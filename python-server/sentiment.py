from nltk.corpus import opinion_lexicon
from nltk.tokenize import treebank

tokenizer = treebank.TreebankWordTokenizer()
pos_words = 0
neg_words = 0
neu_words = 0
sentence = "this is good"
tokenized_sent = [word.lower() for word in
                tokenizer.tokenize(sentence)]
print(type(tokenized_sent))
for word in tokenized_sent:
        if word in opinion_lexicon.positive():
            pos_words += 1
        elif word in opinion_lexicon.negative():
            neg_words += 1
        else:
            neu_words += 1

print(pos_words,neg_words,neu_words)
