from flask import Flask, jsonify, request, Response
import urllib2
import json
import datetime
import csv
import time
import config
import os

app = Flask(__name__)
app_id = config.app_id
app_secret = config.app_secret
page_id = "pokemon"
access_token = app_id + "|" + app_secret

def request_all(url):
    req = urllib2.Request(url)
    response = urllib2.urlopen(req)
    # success = False
    # while success is False:
    #     try:
    #         response = urllib2.urlopen(req)
    #         if response.getcode() == 200:
    #             success = True
    #     except Exception, e:
    #         print e
    #         time.sleep(5)
    #
    #         print "Error for URL %s: %s" % (url, datetime.datetime.now())
    #         print "Retrying."

    return response.read()

# Needed to write tricky unicode correctly to csv
def unicode_normalize(text):
    return text.translate({ 0x2018:0x27, 0x2019:0x27, 0x201C:0x22, 0x201D:0x22,
                            0xa0:0x20 }).encode('utf-8')

def getFacebookPageFeedData(page_id, access_token, num_statuses):

    base = "https://graph.facebook.com/v2.6"
    node = "/%s/posts" % page_id
    fields = "/?fields=message,link,created_time,type,name,id," + \
            "comments.limit(0).summary(true),shares,reactions" + \
            ".limit(0).summary(true)"
    parameters = "&limit=%s&access_token=%s" % (num_statuses, access_token)
    url = base + node + fields + parameters

    # retrieve data
    data = json.loads(request_all(url))

    return data

def getReactionsForStatus(status_id, access_token):

    # See http://stackoverflow.com/a/37239851 for Reactions parameters
        # Reactions are only accessable at a single-post endpoint

    base = "https://graph.facebook.com/v2.6"
    node = "/%s" % status_id
    reactions = "/?fields=" \
            "reactions.type(LIKE).limit(0).summary(total_count).as(like)" \
            ",reactions.type(LOVE).limit(0).summary(total_count).as(love)" \
            ",reactions.type(WOW).limit(0).summary(total_count).as(wow)" \
            ",reactions.type(HAHA).limit(0).summary(total_count).as(haha)" \
            ",reactions.type(SAD).limit(0).summary(total_count).as(sad)" \
            ",reactions.type(ANGRY).limit(0).summary(total_count).as(angry)"
    parameters = "&access_token=%s" % access_token
    url = base + node + reactions + parameters

    # retrieve data
    data = json.loads(request_all(url))

    return data

def processFacebookPageFeedStatus(status, access_token):
    status_id = status['id']
    status_message = '' if 'message' not in status.keys() else \
            unicode_normalize(status['message'])
    # reduce_message =
    link_name = '' if 'name' not in status.keys() else \
            unicode_normalize(status['name'])
    status_type = status['type']
    status_link = '' if 'link' not in status.keys() else \
            unicode_normalize(status['link'])

    status_published = datetime.datetime.strptime(
            status['created_time'],'%Y-%m-%dT%H:%M:%S+0000')
    status_published = status_published + \
            datetime.timedelta(hours=-5) # EST
    status_published = status_published.strftime(
            '%Y-%m-%d %H:%M:%S') # best time format for spreadsheet programs

    num_reactions = 0 if 'reactions' not in status else \
            status['reactions']['summary']['total_count']
    num_comments = 0 if 'comments' not in status else \
            status['comments']['summary']['total_count']
    num_shares = 0 if 'shares' not in status else status['shares']['count']

    # Counts of each reaction separately; good for sentiment
    reactions = getReactionsForStatus(status_id, access_token) if \
            status_published > '2016-02-24 00:00:00' else {}

    num_likes = 0 if 'like' not in reactions else \
            reactions['like']['summary']['total_count']

    # Special case: Set number of Likes to Number of reactions for pre-reaction
    # statuses
    num_likes = num_reactions if status_published < '2016-02-24 00:00:00' \
            else num_likes

    def get_num_total_reactions(reaction_type, reactions):
        if reaction_type not in reactions:
            return 0
        else:
            return reactions[reaction_type]['summary']['total_count']

    num_loves = get_num_total_reactions('love', reactions)
    num_wows = get_num_total_reactions('wow', reactions)
    num_hahas = get_num_total_reactions('haha', reactions)
    num_sads = get_num_total_reactions('sad', reactions)
    num_angrys = get_num_total_reactions('angry', reactions)

    good_reception = num_loves + num_wows + .5*num_likes + 1.5*num_shares
    bad_reception = 1.5*num_sads + 2*num_angrys
    # Return a tuple of all processed data
    return (status_id, status_message, link_name, status_type, status_link,
            status_published, num_reactions, num_comments, num_shares,
            num_likes, num_loves, num_wows, num_hahas, num_sads, num_angrys, good_reception, bad_reception)

def scrapeFacebookPageFeedStatus(page_id, access_token):
    with open('data/%s_facebook_statuses.csv' % page_id, 'wb') as file:
        w = csv.writer(file)
        w.writerow(["status_id", "status_message", "link_name", "status_type",
                    "status_link", "status_published", "num_reactions",
                    "num_comments", "num_shares", "num_likes", "num_loves",
                    "num_wows", "num_hahas", "num_sads", "num_angrys", "good_reception", "bad_reception"])

        has_next_page = True
        num_processed = 0   # keep a count on how many we've processed
        scrape_starttime = datetime.datetime.now()

        print "Scraping %s Facebook Page: %s\n" % (page_id, scrape_starttime)

        statuses = getFacebookPageFeedData(page_id, access_token, 100)

        while has_next_page:
            for status in statuses['data']:

                # Ensure it is a status with the expected metadata
                if 'reactions' in status:
                    w.writerow(processFacebookPageFeedStatus(status,
                        access_token))

                num_processed += 1
                if num_processed % 25 == 0:
                    print "%s Statuses Processed: %s" % \
                        (num_processed, datetime.datetime.now())

            if 'paging' in statuses.keys():
                statuses = json.loads(request_all(
                                        statuses['paging']['next']))
            else:
                has_next_page = False


        print "\nDone!\n%s Statuses Processed in %s" % \
                (num_processed, datetime.datetime.now() - scrape_starttime)

def csv_to_json(page_id):
    print("Converting csv to json")

    csv_file = open('data/%s_facebook_statuses.csv' % page_id, 'rU')
    reader = csv.DictReader(csv_file, fieldnames = ( "status_id",
                "status_message", "link_name", "status_type",
                "status_link", "status_published", "num_reactions",
                "num_comments", "num_shares", "num_likes", "num_loves",
                "num_wows", "num_hahas", "num_sads", "num_angrys", "good_reception", "bad_reception"))
    out = jsonify([row for row in reader])
    print(type(out))
    return out
    # with open('data/%s_facebook_statuses.csv' % page_id, mode='r') as infile:
    #     reader = csv.reader(infile)
    #     with open('data/%s_facebook_statuses.txt' % page_id, mode="w") as outfile:
    #         writer = csv.writer(outfile)
    #         dat_dict = {rows[0]:rows[1:] for rows in reader}
    # return jsonify(**dat_dict)

@app.route('/')
def index():
    return "Welcome to our REST API. This is for our <b>HackUCI 2017</b> project. You can make requests with making a GET request to a Facebook page with GET /req?https://www.facebook.com/CitrusHack/ for example. <br><br> This project is by: Aaroh Mankad(UCR), Kevin Wong(UCI), John Pham(UCR), and Raelene Gonzales(UCI)."

@app.route('/req', methods=['GET'])
def get_task():
    # Input is the Facebook URL
    all_args = request.args.lists()
    fb_url = str(all_args[0][0])
    fb_id = fb_url.split('/')
    if not os.path.isfile('data/%s_facebook_statuses.csv' % fb_id[3]):
        scrapeFacebookPageFeedStatus(fb_id[3], access_token)
    print("Data exist already, skipping scrape")
    return csv_to_json(fb_id[3])

    # return fb_url

if __name__ == '__main__':
    app.debug = True
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
