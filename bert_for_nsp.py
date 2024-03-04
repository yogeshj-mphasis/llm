# -*- coding: utf-8 -*-
"""Bert_for_NSP.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1hhWNJFt7bAvQHJcFRkSIdnq3oOTMzyuA
"""

from transformers import BertTokenizer, BertForNextSentencePrediction
import torch
import nltk

nltk.download('punkt')

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForNextSentencePrediction.from_pretrained('bert-base-uncased')

def predict_next_sentence(sentence1, sentence2):
    tokens = tokenizer(sentence1, sentence2, return_tensors='pt')

    logits = model(**tokens).logits

    probabilities = torch.softmax(logits, dim=1)

    next_sentence_probability = probabilities[:, 0].item()

    return next_sentence_probability

input = input('Type\n')

para = 'We apologize for the delay in processing your order. Due to unexpectedly high demand, our fulfillment center is experiencing delays in dispatching orders. We are working tirelessly to expedite your order and appreciate your patience. Regrettably, your order has been delayed due to unforeseen logistical challenges. Rest assured, we are actively resolving these issues to ensure your order reaches you as soon as possible. Thank you for your understanding.We wanted to inform you that there will be a slight delay in shipping your order. Our warehouse is currently undergoing inventory maintenance, causing a temporary delay in processing orders. We apologize for any inconvenience caused and appreciate your patience. We apologize for the delay in your order shipment. Unfortunately, a technical issue with our order processing system has caused delays in fulfilling orders. Our technical team is actively working to resolve the issue, and we aim to dispatch your order promptly. Thank you for your understanding and patience.We regret to inform you that your order has been delayed due to a supplier issue. We are in contact with our suppliers to expedite the delivery of necessary materials. Rest assured, we are doing everything in our power to minimize the delay and appreciate your understanding during this time.We regret to inform you that your order is experiencing a delay in shipment due to severe weather conditions affecting our shipping routes. We prioritize the safety of our employees and partners, which may result in temporary disruptions. We appreciate your patience and understanding during this challenging time.We apologize for the delay in processing your order. Our team is currently implementing a system upgrade to enhance our order processing efficiency. While this upgrade is underway, there may be slight delays in fulfilling orders. We assure you that this upgrade will ultimately improve our service and greatly appreciate your patience.'

sentences = nltk.tokenize.sent_tokenize(para)

sentences

lis = []
for i in sentences:
  probability = predict_next_sentence(input, i)
  lis.append(probability)
print(f"Best suited sentence from the given dataset for inputed sentence is: {sentences[lis.index(max(lis))]}")