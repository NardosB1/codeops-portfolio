import heapq
#1.BST & In-Order Traversal
class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

def insert(root, value):
    if root is None:
        return Node(value)
    if value < root.val:
        root.left = insert(root.left, value)
    elif value > root.val:
        root.right = insert(root.right, value)
    return root

def inorder_traversal(root, result=None):
    if result is None:
        result = []
    if root:
        inorder_traversal(root.left, result)
        result.append(root.val)
        inorder_traversal(root.right, result)
    return result



#2.Tree Depth (Height)
def height(node):
    if node is None:
        return -1   #returns -1 for empty tree, 0 for single node
    left_height = height(node.left)
    right_height = height(node.right)
    return max(left_height, right_height) + 1



#3.Graph BFS
def bfs(graph, start):
    visited = set()
    queue = [start]
    visited.add(start)
    
    while queue:
        vertex = queue.pop(0)
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                
    return visited



#4.Graph DFS
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited



#5.Priority Queue using heapq
def priority_queue_demo():
    pq = []
    tasks = [
        (3, "Read book"),
        (1, "Fix critical bug"),
        (4, "Write documentation"),
        (2, "Review pull request"),
        (5, "Clean desk")
    ]
    
    # Push items into the priority queue
    for priority, task in tasks:
        heapq.heappush(pq, (priority, task))
        
    # Pop items out by priority
    sorted_tasks = []
    while pq:
        priority, task = heapq.heappop(pq)
        sorted_tasks.append((priority, task))
        
    return sorted_tasks



if __name__ == "__main__":
    root = None
    values = [50, 30, 70, 20, 40, 60, 80]
    for v in values:
        root = insert(root, v)
    print("Sorted In-Order Traversal: ", inorder_traversal(root))
    
    print("Tree Height:", height(root))
    
    sample_graph = {
        'A': ['B', 'C'],
        'B': ['A', 'D', 'E'],
        'C': ['A', 'F'],
        'D': ['B'],
        'E': ['B', 'F'],
        'F': ['C', 'E']
    }
    print("BFS Reachable Vertices:", bfs(sample_graph, 'A'))
    print("DFS Visit Order Set:", dfs(sample_graph, 'A'))
    
    print("Popped from Priority Queue:")
    for p, t in priority_queue_demo():
        print(f"Priority {p}: {t}")