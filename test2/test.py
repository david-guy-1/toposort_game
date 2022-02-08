import cv2
import numpy as np
img = cv2.imread("a_transparent.png",cv2.IMREAD_UNCHANGED)

print(img.shape) #stored as 3d matrix : height, width, 4 (bgra)
# aa is 0 (transparent) to 255 (opaque)
#row and column

#image is 602 x 977 , 977 rows, 602 columns

#this will work
print(img[976,601])
#image is bgr

try:
    print(img[601,976])
except IndexError:
    print("out of bounds")


def loadImage(img): #automatically uses alpha
    img = cv2.imread("a_transparent.png",cv2.IMREAD_UNCHANGED)
    if(img.shape[2] == 3):
        out = np.full([img.shape[0], img.shape[1], 4], 255)
        out[:,:,0:3] = img
        return out
    else:
        return img
def addTransparent(img1, img2):
    #uses img2's alpha channel
    #img1's value = (1 - img2's alpha) * img1's value + (img2's alpha) * img2's value
    #mutates img1
    alphas = 1/256 * img2[:,:,3]
    oneMinus = np.full(img1.shape[0:2], 1) - alphas
    for i in range(3):
        img1[:,:,i] = np.multiply(oneMinus, img1[:,:,i]) + np.multiply(alphas, img2[:,:,i]) #component wise multiplication



###DO NOT DO IT LIKE THIS!!!
###let's try to make a square in the top middle part black
##for x in range(200,400):
##    for y in range(0, 200):
##        img[y,x] = [0,0,0,255]
###write it
##cv2.imwrite("top_is_black.png", img)


#a faster way is to use numpy submatrix

img = cv2.imread("a_transparent.png",cv2.IMREAD_UNCHANGED)
newArray = np.zeros([200,200,4])
newArray[0:200,0:200,0].fill(255)
newArray[0:200,0:200,1].fill(128)
newArray[0:200,0:200,2].fill(0)
newArray[0:200,0:200,3].fill(255)
img[0:200, 200:400, 0:4] = newArray #remember coords are y,x
#so if we want top center side, x is 200-400, y is 0-200 
cv2.imwrite("top_is_black.png", img)

#let's try doing matrix operations.

#blue -> add green and blue
img = cv2.imread("a_transparent.png",cv2.IMREAD_UNCHANGED)
print(img[221,312])
transform = np.array([[1,1,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]])
img = np.dot(img, np.transpose(transform)) #note the transpose!
print(img[221,312])
cv2.imwrite("green_blue_add.png", img)

##any super blue parts will be made red
#now we have to iterate

#numpy addition is mod 256

img = cv2.imread("a.png",cv2.IMREAD_UNCHANGED)
transform = np.array([[0,0,0,0],[0,1,0,0],[1,0,1,0],[0,0,0,1]])
#new image that will be merged

img2 = np.zeros(img.shape)



#make the img2 consisting of only blue pixels
for y in range(img.shape[0]):
    for x in range(img.shape[1]):
        tol = 0.86
        if(img[y,x,0]*tol>img[y,x,1] and img[y,x,0]*tol>img[y,x,2]):
            img2[y,x,0:4] = np.matmul(transform,img[y,x,0:4])
print("done manually doing stuff")
addTransparent(img, img2)
cv2.imwrite("blue_parts.png", img)


