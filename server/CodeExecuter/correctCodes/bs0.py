def binary_search(arr, x):
    low = 0
    high = len(arr) - 1
    mid = 0

    while low <= high:

        mid = (high + low) // 2

        if arr[mid] < x:
            low = mid + 1

        elif arr[mid] > x:
            high = mid - 1

        else:
            return mid

    return -1


arr = []
n = int(input())

for i in range(0, n):
    ele = int(input())
    arr.append(ele)

x = int(input())

result = binary_search(arr, x)
print(result)
