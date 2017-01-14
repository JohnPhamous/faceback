import csv, json

# Open the CSV
f = open( 'data/citrushack_facebook_statuses.csv', 'rU' )
# Change each fieldname to the appropriate field name
reader = csv.DictReader( f, fieldnames = ( "status_id", "status_message", "link_name", "status_type",
            "status_link", "status_published", "num_reactions",
            "num_comments", "num_shares", "num_likes", "num_loves",
            "num_wows", "num_hahas", "num_sads", "num_angrys", "good_reception", "bad_reception"))
# Parse the CSV into JSON
out = json.dumps( [ row for row in reader ] )
print "JSON parsed!"
# Save the JSON
# f = open( '/path/to/parsed.json', 'w')
# f.write(out)
print "JSON saved!"
print out[0]
