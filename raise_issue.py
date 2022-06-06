import sys
import requests
import json

TOKEN = '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'

# The repository to add this issue to to be passed in json

REPO_OWNER = 'rachel-menezes'
REPO_NAME = 'winter22-project0'

def make_github_issue(title, body=None, created_at=None, closed_at=None, updated_at=None, assignee=None, milestone=None, closed=None, labels=None):
    # Create an issue on github.com using the given parameters
    # Url to create issues via POST
    url = 'https://api.github.com/repos/%s/%s/issues' % (REPO_OWNER, REPO_NAME)
    # print(url)
    # Headers
    headers = {
        "Authorization": "token %s" % TOKEN,
        "Accept": "application/vnd.github.golden-comet-preview+json"
    }
    
    # Create our issue
    data = {          'title': title,
                      'body': body,
                      'created_at': created_at,
                      'closed_at': closed_at,
                      'updated_at': updated_at,
                      'assignees': assignees,
                      'closed': closed,
                      'labels': labels
            }

    payload = json.dumps(data)

    # Add the issue to our repository
    response = requests.post(url, data=payload, headers=headers)
    if response.status_code == 201:
        print('Successfully created Issue {0:s}'.format(title))
    else:
        print ('Could not create Issue {0:s}'.format(title))
        print ('Response:', response.content , response.status_code)



title = 'Pretty issue'
body = body = """**Note: for support questions, please use stackoverflow**. This repository's issues are reserved for feature requests and bug reports.

* **I'm submitting a issue req for **
  ```
  ♂ require('../app');<br/>var intl = require('../intl');<br/>var log = require('../log');<br/>var Constants = require('../util/constants');<br/>var KeyboardListener = require('../util/keyboard').KeyboardListener;<br/>var debounce = require('../util/debounce');<br/>var throttle = require('../util/throttle');<br/><br/>var BaseView = Backbone.View.extend({<br/>  getDestination: function() {<br/>    return this.destination || this.container.getInsideElement();<br/>  },<br/><br/>  tearDown: function() {<br/>    this.$el.remove();<br/>
  ```
""
created_at = "2014-01-01T12:34:58Z"
closed_at = "2014-01-02T12:24:56Z"
updated_at = "2014-01-03T11:34:53Z"
assignees = [ 'rachel-menezes' ]
milestone = 1
closed = False
labels = [
    "low"
]

make_github_issue(title, body, created_at, closed_at, updated_at, assignees, milestone, closed, labels)