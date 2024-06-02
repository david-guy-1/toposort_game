lines = open("monster.txt","r").readlines()
for line in lines:
    try:
        line.index("\"link\" :")
    except ValueError:
        print(line)
        continue
    else:
        start =line.index('"link" : "') + len('"link" : "')
        end = line.index('", "color":')
        name = line[start:end]
        nameNoPng = name[0:len(name)-4]
        print(line[0:start-1] + "[\"" + name + '", "' + nameNoPng + '_attack.png"],' + line[end+2:])
