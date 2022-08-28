"""
External method for korrektur view in view.py of the abfrage app.

"""
import re
import os


def voc_transformer(voc_string):
    """
    Transform a string with multiple vocabulary and pontetially non alphanumeric characters,
    into a list of vocabulary with only alphanumeric charachters.

    **Context**

    ``voc_string``
        Vocabulary as a string in wich vthe words are in lises beneath each other.

    ``voc_lines``
        Vocabulary as a string with no empty lines.

    ``voc_list``
       Vocabulary in array.

    ``corrected_voc_list``
        Corrected vocabulary in array.

    ``voc_only``
        Some vocabulary have brackets behind them. voc_only is the vocabulary 
        string without the brackets.

    ``voc_alphanumeric``
        Vocabulary string with only alphanumeric characters.

    """
    voc_lines = os.linesep.join([s for s in voc_string.splitlines() if s])
    voc_list = voc_lines.splitlines()
    corrected_voc_list = []
    for voc in voc_list:
        voc_only = voc.split("[")[0]
        voc_alphanumeric = re.sub(r"[^\w]", " ", voc_only)
        corrected_voc_list.append(voc_alphanumeric)

    return corrected_voc_list
