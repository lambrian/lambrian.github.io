#!/usr/bin/env python

import os
import sys
from datetime import datetime 


HOME_DIR = os.path.expanduser('~')
REPO_DIR = HOME_DIR + "/Developer/lambrian.github.io"

def create_file():
    now = datetime.now()
    title = sys.argv[1].lower().replace(" ", "-")
    filename = "%s-%s.markdown" % (now.strftime("%Y-%m-%d"), title)

    filepath = REPO_DIR + "/_drafts/%s" % filename
    if (os.path.isfile(filepath)):
        print "%s already exists." % filename
        return

    f = open(filepath, "w+")
    f.write("---\n")
    f.write("layout: post\n")
    f.write("title: %s\n" % sys.argv[1])
    f.write("date: %s\n" % now.strftime("%Y-%m-%d %H:%M:%S -0800"))
    f.write("---\n")

create_file()
