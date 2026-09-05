from collections import Counter

#1. Even nums
def getOnlyEvens(arr):
    result = [x for i, x in enumerate(arr) if i%2 == 0 and x%2 == 0]
    print(result)
    return result
getOnlyEvens([1, 2, 3, 6, 4, 8])
getOnlyEvens([0, 1, 2, 3, 4])



#2. Reverse
def reverseCompare(num):
    first_digit = num // 10
    second_digit = num % 10

    if second_digit > first_digit:
        print("Ok")
    else:
        print("Not ok")
reverseCompare(72)
reverseCompare(23)



#3. Factorial
def returnFactorial(n):
   if n<0:
       raise ValueError("Factroeial is not defined for negative numbers.")
   result = 1
   for i in range(1, n + 1):
       result *= i
   return result   
print(returnFactorial(5))
print(returnFactorial(6))
print(returnFactorial(0))



#4. Meera array
def checkMeera(arr):
    num_set = set(arr)

    for num in arr:
        if (num !=0 and num *2 in num_set) or (num == 0 and arr.count(0) > 1):
          print("I am NOT a Meera array")  
          return
        print("I am a Meera array")
        #return

checkMeera([10, 4, 0, 5])    
checkMeera([7, 4, 9])
checkMeera([1, -6, 4, -3])      


#5. Dual Array
def isDual(arr):
    if not arr:
        return 0
    
    counts = Counter(arr)
    for count in counts.values():
        if count != 2:
            return 0
    return 1

print(isDual([1, 2, 1, 3, 3, 2]))  
print(isDual([2, 5, 2, 5, 5]))     
print(isDual([3, 1, 1, 2, 2]))


#6. Digital Clock
def digitalClock(seconds):
    seconds %= 86400
    
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"
print(digitalClock(5025))   
print(digitalClock(61201)) 
print(digitalClock(87000))