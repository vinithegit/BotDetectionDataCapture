# -*- coding: utf-8 -*-
# <nbformat>3.0</nbformat>

# <codecell>

import json
import numpy as np

from scipy.stats import multivariate_normal
from sklearn.metrics import f1_score
from os import listdir
from os.path import isfile, join
import sys
from sklearn import preprocessing
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.svm import OneClassSVM

# <codecell>

def featuresFromKeyPressTimings(timings, raw = False):
    if raw == False:
        return [np.mean(timings), np.max(timings), 1+np.std(timings)]
    else:
        paddedTimings = [0]*20
        for i in range(min(19,len(timings))):
            paddedTimings[i] = timings[i]
        return paddedTimings

def featuresFromMouseMovements(mouseMovements, raw = False):
    speeds = []
    prevSlope = 0
    curvatures = []
    for i in range(1,len(mouseMovements)):
        point1 = mouseMovements[i-1]
        point2 = mouseMovements[i]
        speed = np.sqrt((point2['x'] - point1['x'])**2 + (point2['y'] - point1['y'])**2)
        speeds.append(speed)
        delta_x_raw = point2['x'] - point1['x']
        delta_x = 1 if delta_x_raw == 0 else delta_x_raw
        slope = (point2['y'] - point1['y'])/delta_x
        curvature = (slope - prevSlope)/delta_x
        curvatures.append(curvature)
        prevSlope = slope
    if raw == False:
        return [np.mean(speeds), np.max(speeds), np.std(speeds),
            np.mean(curvatures), np.max(curvatures), np.std(curvatures)]
    else:
        paddedSpeeds = [0]*100
        for i in range(min(19,len(speeds))):
            paddedSpeeds[i] = speeds[i]
        paddedCurvatures = [0]*100
        for i in range(min(19,len(curvatures))):
            paddedCurvatures[i] = curvatures[i]
        featureVector = []
        featureVector.extend(paddedSpeeds)
        featureVector.extend(paddedCurvatures)
        return featureVector

def getFeatureVector(jsonData):
    featureVector = []
    jsonObject = json.loads(jsonData)
    featureVector.extend(featuresFromKeyPressTimings(jsonObject['usernameTimings']))
    featureVector.extend(featuresFromMouseMovements(jsonObject['mousePositions']))
    featureVector.extend(featuresFromKeyPressTimings(jsonObject.get('emailIDTimings', [0, 0])))
    return np.nan_to_num(featureVector)

def read_dataset(directory):
    dataset = None
    filesInDir = [f for f in listdir(directory) if isfile(join(directory, f))]
    for file in filesInDir:
        with open(directory + '/' + file, 'r') as jsonFile:
            print(directory + '/' + file)
            featureVector = getFeatureVector(jsonFile.read())
            if dataset is None:
                dataset = np.array([featureVector])
            else:
                dataset = np.concatenate((dataset, [featureVector]), axis=0)
    return dataset

# <codecell>

def feature_normalize(dataset):
    mu = np.mean(dataset,axis=0)
    sigma = np.std(dataset,axis=0)
    return (dataset - mu)/sigma

def estimateGaussian(dataset):
    mu = np.mean(dataset, axis=0)
    sigma = np.cov(dataset.T)
    return mu, sigma
    
def multivariateGaussian(dataset,mu,sigma):
    p = multivariate_normal(mean=mu, cov=sigma, allow_singular=True)
    return p.pdf(dataset)

# # <codecell>

def selectThresholdByCV(probs,gt):
    best_epsilon = 0
    best_f1 = 0
    f = 0
    stepsize = (max(probs) - min(probs)) / 1000;
    epsilons = np.arange(min(probs),max(probs),stepsize)
    for epsilon in np.nditer(epsilons):
        predictions = (probs < epsilon)
        f = f1_score(gt, predictions, average = "binary")
        if f > best_f1:
            best_f1 = f
            best_epsilon = epsilon
    return best_f1, best_epsilon

# # <codecell>

tr_path=sys.argv[1]
cv_path=sys.argv[2]
bot_path=sys.argv[3]

tr_data = read_dataset(tr_path)   #training data dir
cv_data = read_dataset(cv_path)   #cross validation data dir
bot_data = read_dataset(bot_path)

scaler = preprocessing.StandardScaler().fit(tr_data)

tr_data = scaler.transform(tr_data)
cv_data = scaler.transform(cv_data)
bot_data = scaler.transform(bot_data)

#Hard coded for testing. will change
gt_data = [+1]*23

# Outlier detection code using multi variate gaussian

# mu, sigma = estimateGaussian(tr_data)
# p = multivariateGaussian(tr_data,mu,sigma)
# p_cv = multivariateGaussian(cv_data,mu,sigma)
# fscore, ep = selectThresholdByCV(p_cv,gt_data)
# mu, sigma = estimateGaussian(bot_data)
# p_bot = multivariateGaussian(bot_data,mu,sigma)

# outliers = p_bot < ep

# print (outliers)
# <codecell>

# Novelty detection using one class SVM

outlierDetector = OneClassSVM()
outlierDetector.fit(cv_data, gt_data)

bot_preds = outlierDetector.predict(bot_data)

print(bot_preds)