#Valid Parentheses

def validParenthesis(s):
  stack = []
  matching_brackets = {')': '(', ']': '[', '}': '{'}