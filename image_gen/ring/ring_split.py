
import cv2
import numpy as np

#first "real" example
img = cv2.imread("ring.png",cv2.IMREAD_UNCHANGED)

greenPart = np.zeros(img.shape)
redPart = np.zeros(img.shape)


def getColor(img, color, tol):
    #"color" is "blue", "green" or "red"
    #"tol" is a number 0 to 1
    colorPart = np.zeros(img.shape)
    for y in range(img.shape[0]):
        for x in range(img.shape[1]):
            if(color == "blue"):
                if(img[y,x,0]*tol>img[y,x,1] and img[y,x,0]*tol>img[y,x,2]):
                    colorPart[y,x,0:4] = img[y,x,0:4]
            elif(color == "green"):
                if(img[y,x,1]*tol>img[y,x,0] and img[y,x,1]*tol>img[y,x,2]):
                    colorPart[y,x,0:4] = img[y,x,0:4]

            elif(color == "red"):
                if(img[y,x,2]*tol>img[y,x,1] and img[y,x,2]*tol>img[y,x,0]):
                    colorPart[y,x,0:4] = img[y,x,0:4]

            else:
                raise Exception("invalid color " + str(color)) 
    return colorPart
            
def addTransparent(img1, img2):
    #uses img2's alpha channel
    #img1's value = (1 - img2's alpha) * img1's value + (img2's alpha) * img2's value
    #mutates img1
    alphas = 1/256 * img2[:,:,3]
    oneMinus = np.full(img1.shape[0:2], 1) - alphas
    for i in range(3):
        img1[:,:,i] = np.multiply(oneMinus, img1[:,:,i]) + np.multiply(alphas, img2[:,:,i]) #component wise multiplication


greenPart = getColor(img, "green", 0.86)
redPart = getColor(img, "red", 0.86)

cv2.imwrite("ring_green.png", greenPart)

cv2.imwrite("ring_red.png", redPart)
