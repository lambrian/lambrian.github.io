#!/usr/bin/env python

import os
import sys
from datetime import datetime 

def create_file():
    now = datetime.now()
    title = sys.argv[1].lower().replace(" ", "-")
    filename = "%s-%s.markdown" % (now.strftime("%Y-%m-%d"), title)

    filepath = "../_drafts/%s" % filename
    if (os.path.isfile(filepath)):
        return

    f = open(filepath, "w+")
    f.write("---\n")
    f.write("layout: post\n")
    f.write("title: %s\n" % sys.argv[1])
    f.write("date: %s\n" % now.strftime("%Y-%m-%d %H:%M:%S -0800"))
    f.write("---\n")

create_file()
