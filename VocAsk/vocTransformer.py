from textblob import TextBlob
import re
import os


def vocTransformer(text):
    texta = os.linesep.join([s for s in text.splitlines() if s])
    listvoc = texta.splitlines()
    listvoc2 = list(range(len(listvoc)))
    for a in listvoc:
        b = TextBlob(a)
        c = str(b.correct())
        a = re.sub(r"[^\w]", " ", c)

    return listvoc
