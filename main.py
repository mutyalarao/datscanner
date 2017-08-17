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


class launcher(object):
    @cherrypy.expose
    def index(self):
        return open('./views/index.html')

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
            inp = cherrypy.request.json
            print(inp)
        #inp = cherrypy.request.json
        print "hiii"
        result = {"recordList":["ps_job","ps_person"]}
        return result


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
    webapp =  launcher()
    cherrypy.quickstart(webapp,'/',conf)
