#1.Recursive sum and count down
def total(nums):
    if not nums:
        return 0
    return nums[0] + total(nums[1:])

def count_down(n):
    if n <= 0:
        return
    print(n, end=" ")
    count_down(n - 1)

if __name__ == "__main__":
    print("Recursive Sum of [1, 2, 3, 4, 5] =", total([1, 2, 3, 4, 5]))
    print("Count down from 5: ", end="")
    count_down(5)
    print("\n")    



#2.Binary search
def binary_search(items, target):
    left = 0
    right = len(items) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1

balances = [100.50, 250.00, 500.75, 1200.00, 3500.25]
print("Sorted balances:", balances)
print("Index of 500.75:", binary_search(balances, 500.75))
print("Index of 999.00:", binary_search(balances, 999.00))


#3.Merge sort
def merge_sort(items):
    if len(items) <= 1:
        return items
        
    mid = len(items) // 2
    left = merge_sort(items[:mid])
    right = merge_sort(items[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
            
    result.extend(left[i:])
    result.extend(right[j:])
    return result

import random
random_list = [random.randint(1, 100) for _ in range(8)]
sorted_result = merge_sort(random_list)
print("Random list:", random_list)
print("Merge sorted:", sorted_result)
print("Matches built-in sorted():", sorted_result == sorted(random_list))



#4.Sort with a key
def sort_by_balance_descending(accounts):
    return sorted(accounts, key=lambda x: x[1], reverse=True)

accounts = [("Almaz", 150.0), ("Brook", 1200.5), ("Chala", 450.0)]
sorted_accounts = sort_by_balance_descending(accounts)
print("Accounts sorted by balance descending:", sorted_accounts)



#5.Two pointers
def has_pair(nums, target):
    left = 0
    right = len(nums) - 1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return True
        elif current_sum < target:
            left += 1
        else:
            right -= 1
            
    return False

sorted_nums = [1, 2, 4, 7, 11, 15]
target_val = 15
print(f"List {sorted_nums} has pair summing to {target_val}:", has_pair(sorted_nums, target_val))
print(f"List {sorted_nums} has pair summing to 20:", has_pair(sorted_nums, 20))