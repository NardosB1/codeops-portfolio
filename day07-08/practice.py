def linear_search(items, target):
    for i, x in enumerate(items):
        if x == target:
            return i
    #return -1        


balances = [1000, 2000, 3000, 4000, 5000]   
linear_search(balances, 3000)
print(linear_search(balances, 4000))


def binary_search(items, target):
    lo, hi = 0, len(items) - 1
    while lo <= hi:
        mid = (lo + hi)  //2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

print({hi}, {lo})
print(linear_search(balances, 4000))
