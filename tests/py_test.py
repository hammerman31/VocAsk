from spellchecker import SpellChecker
from textblob import TextBlob

#spell = SpellChecker()
#misspelled = spell.unknown(['sonethimg', 'is', 'hapenig', 'herre', "anwersary", 'borth', "war", ':°to ele8t', 'taxaton', 'representation', 'custums', 'troopps', 'violence', 'anong'])
#for word in misspelled:
#    print(spell.correction(word))

 
a = ":°ele8t"           # incorrect spelling
lista = ['sonethimg', 'is', 'hapenig', 'herre', "anwersary", 'borth', "war", ':°to ele8t', 'taxaton', 'representation', 'custums', 'troopps', 'violence', 'anong']
for a in lista:
    b = TextBlob(a)
    
    # prints the corrected spelling
    print(str(b.correct()))