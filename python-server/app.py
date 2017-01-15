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

def getFacebookCommentFeedData(status_id, access_token, num_comments):
    # Construct the URL string
    base = "https://graph.facebook.com/v2.6"
    node = "/%s/comments" % status_id
    fields = "?fields=id,message,like_count,created_time,comments,attachment"
    parameters = "&order=chronological&limit=%s&access_token=%s" % \
        (num_comments, access_token)
    url = base + node + fields + parameters

    # retrieve data
    data = request_all(url)
    if data is None:
        return None
    else:
        return json.loads(data)


def processFacebookComment(comment, status_id, parent_id=''):

    # The status is now a Python dictionary, so for top-level items,
    # we can simply call the key.

    # Additionally, some items may not always exist,
    # so must check for existence first

    comment_id = comment['id']
    comment_message = '' if 'message' not in comment else \
        unicode_normalize(comment['message'])
    comment_likes = 0 if 'like_count' not in comment else \
        comment['like_count']

    if 'attachment' in comment:
        attach_tag = "[[%s]]" % comment['attachment']['type'].upper()
        comment_message = attach_tag if comment_message is '' else \
            (comment_message.decode("utf-8") + " " +
             attach_tag).encode("utf-8")

    # Time needs special care since a) it's in UTC and
    # b) it's not easy to use in statistical programs.

    comment_published = datetime.datetime.strptime(
        comment['created_time'], '%Y-%m-%dT%H:%M:%S+0000')
    comment_published = comment_published + datetime.timedelta(hours=-5)  # EST
    comment_published = comment_published.strftime(
        '%Y-%m-%d %H:%M:%S')  # best time format for spreadsheet programs

    # Return a tuple of all processed data

    return (comment_id, status_id, parent_id, comment_message,
            comment_published, comment_likes)


def scrapeFacebookPageFeedComments(page_id, access_token):
    with open('data/%s_facebook_comments.csv' % page_id, 'wb') as file:
        w = csv.writer(file)
        w.writerow(["comment_id", "status_id", "parent_id",
                    "comment_message", "comment_published", "comment_likes"])

        num_processed = 0   # keep a count on how many we've processed
        scrape_starttime = datetime.datetime.now()

        print "Scraping %s Comments From Posts: %s\n" % \
            (page_id, scrape_starttime)

        with open('data/%s_facebook_statuses.csv' % page_id, 'rb') as csvfile:
            reader = csv.DictReader(csvfile)

            #reader = [dict(status_id='759985267390294_1158001970921953')]

            for status in reader:
                has_next_page = True

                comments = getFacebookCommentFeedData(status['status_id'],
                                                      access_token, 100)

                while has_next_page and comments is not None:
                    for comment in comments['data']:
                        w.writerow(processFacebookComment(comment,
                                                          status['status_id']))

                        if 'comments' in comment:
                            has_next_subpage = True

                            subcomments = getFacebookCommentFeedData(
                                comment['id'], access_token, 100)

                            while has_next_subpage:
                                for subcomment in subcomments['data']:
                                    # print (processFacebookComment(
                                        # subcomment, status['status_id'],
                                        # comment['id']))
                                    w.writerow(processFacebookComment(
                                        subcomment,
                                        status['status_id'],
                                        comment['id']))

                                    num_processed += 1
                                    if num_processed % 1000 == 0:
                                        print "%s Comments Processed: %s" % \
                                            (num_processed,
                                             datetime.datetime.now())

                                if 'paging' in subcomments:
                                    if 'next' in subcomments['paging']:
                                        subcomments = json.loads(
                                            request_all(
                                                subcomments['paging']
                                                ['next']))
                                    else:
                                        has_next_subpage = False
                                else:
                                    has_next_subpage = False

                        # output progress occasionally to make sure code is not
                        # stalling
                        num_processed += 1
                        if num_processed % 1000 == 0:
                            print "%s Comments Processed: %s" % \
                                (num_processed, datetime.datetime.now())

                    if 'paging' in comments:
                        if 'next' in comments['paging']:
                            comments = json.loads(request_all(
                                comments['paging']['next']))
                        else:
                            has_next_page = False
                    else:
                        has_next_page = False

        print "\nDone!\n%s Comments Processed in %s" % \
            (num_processed, datetime.datetime.now() - scrape_starttime)

def csv_to_json(page_id, kind):
    print("Converting csv to json")
    csv_file = open('data/{}_facebook_{}.csv'.format(page_id, kind), 'rU')
    reader = csv.DictReader(csv_file, fieldnames = ( "status_id",
                "status_message", "link_name", "status_type",
                "status_link", "status_published", "num_reactions",
                "num_comments", "num_shares", "num_likes", "num_loves",
                "num_wows", "num_hahas", "num_sads", "num_angrys", "good_reception", "bad_reception"))
    out = jsonify([row for row in reader])
    print(type(out))
    return out

@app.route('/')
def index():
    return "Welcome to our REST API. This is for our <b>HackUCI 2017</b> project. You can make requests with making a GET request to a Facebook page with GET /req?https://www.facebook.com/CitrusHack/ for example. <br><br> This project is by: Aaroh Mankad(UCR), Kevin Wong(UCI), John Pham(UCR), and Raelene Gonzales(UCI)."

@app.route('/test', methods=['GET'])
def send():
    url = request.args.get('url')
    kind = request.args.get('kind')
    return url + " " + kind

@app.route('/req', methods=['GET'])
def get_task():
    # Input is the Facebook URL
    all_args = request.args.lists()
    url = request.args.get('url')
    kind = request.args.get('kind')
    fb_id = url.split('/')

    if kind == "s" or kind == "sc":
        if not os.path.isfile('data/%s_facebook_statuses.csv' % fb_id[3]):
            scrapeFacebookPageFeedStatus(fb_id[3], access_token)
            print("New query type, scraping now for statuses...")
        else:
            print("Repeated query, using cache for statuses")

    if kind == "c" or kind == "sc":
        if not os.path.isfile('data/%s_facebook_comments.csv' % fb_id[3]):
            scrapeFacebookPageFeedComments(fb_id[3], access_token)
            print("New query type, scraping now for comments...")
        else:
            print("Repeated query, using cache for comments")

    return csv_to_json(fb_id[3], "statuses")

if __name__ == '__main__':
    app.debug = True
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
