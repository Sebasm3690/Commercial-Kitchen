#nums = [2, 7, 11, 15]
#target = 9
#index_list = []

def twoSum(nums,target):
  length = len(nums)
  nums_dict = {num:i for i,num in enumerate(nums)}
  for i in range(length):
    complement = target - nums[i]
    if (complement in nums_dict and i != nums_dict[complement]):
      return [i, nums_dict[complement]]



## Normal solution
def twoSum(nums,target):
  nums_dict = {}
  
  for i, num in enumerate(nums):
    complement = target - num
    if complement not in nums_dict:
      nums_dict[num] = i
    else:
      return [nums_dict[complement], i]
      

## Solution odd numbers
def twoSum(nums, target):
  r = len(nums) - 1
  l = 0
  while l < r:
    if(nums[l] + nums[r] > target):
      r -= 1
    elif(nums[l] + nums[r] < target):
      l += 1
    else:
      return (l,r)
     



