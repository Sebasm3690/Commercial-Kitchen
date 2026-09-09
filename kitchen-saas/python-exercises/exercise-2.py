# Option 1: Convert the string directly to a set of characters
def charactersCount(s):
  char_set = set()
  l = 0
  r = 0
  max_length = 0
  

  while r < len(s):
    if s[r] in char_set:
      char_set.remove(s[l])
      l += 1
    else:
      char_set.add(s[r])
      r += 1
      max_length = max(max_length,len(char_set))

      ##The line above is the same than this 
      # if len(char_set) > max_length:
      #   max_length = len(char_set)
      

  return max_length   
  






  # 2 Solution 
  def characterCount(s):
    char_dict = {}
    l = 0
    max_length = 0
    
    for r in range(len(s)):
      if s[r] in char_dict:
        l = max(l,char_dict[s[r]] + 1)

      char_dict[s[r]] = r
      max_length = max(max_length, r - l + 1)
      
    return max_length
      




  
  



    
      

