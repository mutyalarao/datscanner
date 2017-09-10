#!/usr/bin/env python
'''
launcher -> render page ->user.select() {select dat file} -> page.send() {path to cherrypy}
till close{
    cherrypy.listen(){path -> open the file and parse.}
        parse(){load the records. and list }
        sendtopage(){the json-fied  record list}
    ->update page(){update the left frame with record list. }
    user.selectARecord -> page.request
    cherrypy.listen(){get the record and fetch the rows and send back}
    ->updatePage(){update the rightframe with record data}
}
'''

import random
import string
import os, os.path
import json
import cherrypy
import sys
import recordParser

class launcher(object):
    def __init__(self):
        self.recordMap = {}
        self.recordList = []


    @cherrypy.expose
    def index(self):
        return open('./views/index_vue.html')

    @cherrypy.expose
    def generate(self, length=8):
        cherrypy.session['mystring'] = ''.join(random.sample(string.hexdigits, int(length)))
        return cherrypy.session['mystring']

    @cherrypy.expose
    def display(self):
        return cherrypy.session['mystring']

    @cherrypy.expose
    @cherrypy.tools.json_out()
    @cherrypy.tools.json_in()
    @cherrypy.tools.accept(media="application/json")
    def api(self, **kwargs):
        if cherrypy.request.method == "POST":
            postInput = cherrypy.request.json
            print(postInput)
            #inp = cherrypy.request.json
            #print "hiii" + inp['filePath']

            if postInput['command']=='openfile':
                self.recordMap = recordParser.parse(postInput['filePath'])
                self.recordList = []
                for r in self.recordMap:
                    self.recordList.append(r)

                result = {"recordList":self.recordList}
                return result

            if postInput['command'] == 'record':
                print(postInput['recordName'])
                result = recordParser.formatRecords(self.recordMap,recordName=postInput['recordName'])
                return {"recordData":result}


if __name__ == '__main__':
    conf = {
            '/': {
                'tools.sessions.on':True
                },
            '/static':{
                'tools.staticdir.on':True,
                'tools.staticdir.root':os.path.abspath(os.getcwd()),
                'tools.staticdir.dir':'./static'
            }
    }
    if (len(sys.argv) > 1):
        fileName=sys.argv[1]
        recordParser.formatRecords(recordParser.parse(fileName))
    else:
        webapp =  launcher()
        cherrypy.quickstart(webapp,'/',conf)
