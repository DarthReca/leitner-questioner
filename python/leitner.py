import os, random

boxes = list()

def save():
    for box in range(1, 4):
        boxFile = open("box" + str(box) + ".txt", "w")
        boxFile.writelines("%s\n" % place for place in boxes[box - 1])
        boxFile.close()
    os._exit(0)

def clamp(minimum, x, maximum):
    return max(minimum, min(x, maximum))

for box in range(1, 4):
    boxFile = open("box" + str(box) + ".txt", "r")
    boxes.append(boxFile.read().splitlines())
    boxFile.close()
while True:
    comm = input("n - To print new question \nq - To quit \n")
    if comm == "q":
        save()
    elif comm == "n":
        box = int(input("Select box: ")) - 1
        if len(boxes[box]) == 0 or box < 0 or box > 2:
            save()
        index = random.randrange(len(boxes[box]))
        item = boxes[box][index]
        print("\n" + item + "\n")
        ans = input("Correct? (y/n) : ")
        boxes[box].pop(index)
        if ans == "y":
            box += 1
        else:
            box -= 1
        box = clamp(0, box, 2)
        boxes[box].append(item)
    else:
        print("Command not avalaible")