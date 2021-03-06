import re




def parse(fileName):
    chunks = []
    chunk = ''
    file = open(fileName,"r")
    for line in file:
        #look for breaker. till then join the lines
        if (line.strip() == '/'):
            chunks.append(chunk)
            chunk = ''
        else:
            chunk = chunk + line

    print(len(chunks))
    file.close()
    return extractRecords(chunks)

def extractRecords(chunks):
    records = []
    recordMap = {}
    record_name = ""
    record_count = 0
    row_count = 0
    chunnk = ''
    for chunk in chunks:
        if(chunk.strip().upper().startswith('EXPORT')):
            record_name = chunk.strip().upper().split('EXPORT')[1]
            #push the record
            recordMap[record_name] = {'header':"",'rows':""}

        if (chunk.find('~~~') >=0):
            #push header
            recordMap[record_name]['header'] = chunk
        if(chunk.find('//')>=0):
            #this is a row. add it to the record dict
            recordMap[record_name]['rows'] = chunk

    return recordMap

def formatRecords(recordMap,recordName = ""):
    html = "<html><body>"
    #fout = open("test.html","w")
    table = ""
    header = ""
    print("recordName="+recordName)
    for r in recordMap:
        print(r)
        print("###")
        print(recordMap[r]['rows'][1:200])
        print('@@@@')

        if recordName != "" and recordName != r :
            continue

        #print(recordMap[r]['header'])
        table="<table>"
        #header = '<tr>'
        #for h in recordMap[r]['header']:
        #    header = header + '<th>' + h + '</th>'
        #header = header + '</tr>'
        header = '<tr class="recordheader"><th>' + recordMap[r]['header'].replace('~~~','</th><th>') + '</th></tr>'
        #table = table + header
        #fout.write()
        rows = '<tr class="recordrow"><td>' + recordMap[r]['rows'].replace('//','</td></tr><tr><td>').replace(',','</td><td>') + '</td></tr>'
        rows = ''.join(''.join(re.split('[AB]\(',rows)).replace(')','').split('\n'))
        #for row in recordMap[r]['rows']:
        #    rows = rows + '<tr>'
            #for cell in row.split(','):
        #        rows = rows + '<td>' + cell + '</td>'
                #print(rows)
        #    rows = rows + '</tr>'
        table = table + header + rows +'</table>'
        #html = html + heading + table
    #html = html + '</body></html>'
    #fout.write(html)
    #fout.close()

    return table
