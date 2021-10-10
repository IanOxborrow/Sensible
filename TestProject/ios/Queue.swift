//
//  Queue.swift
//  TestProject
//
//  Created by Ian Oxborrow on 16/9/21.
//

import Foundation

// https://www.raywenderlich.com/848-swift-algorithm-club-swift-queue-data-structure
public struct Queue<T> {

  fileprivate var list = LinkedList<T>()

  public var isEmpty: Bool {
    return list.isEmpty
  }
  
  public mutating func enqueue(_ element: T) {
    list.append(value: element)
  }

  public mutating func dequeue() -> T? {
    guard !list.isEmpty, let element = list.first else { return nil }

    _ = list.remove(node: element)

    return element.value
  }

  public func peek() -> T? {
    return list.first?.value
  }
}

//https://www.raywenderlich.com/947-swift-algorithm-club-swift-linked-list-data-structure
public class LinkedList<T> {
  // 2. Change the head and tail variables to be constrained to type T
  fileprivate var head: Node<T>?
  private var tail: Node<T>?

  public var isEmpty: Bool {
    return head == nil
  }
  
  // 3. Change the return type to be a node constrained to type T
  public var first: Node<T>? {
    return head
  }

  // 4. Change the return type to be a node constrained to type T
  public var last: Node<T>? {
    return tail
  }

  // 5. Update the append function to take in a value of type T
  public func append(value: T) {
    let newNode = Node(value: value)
    if let tailNode = tail {
      newNode.previous = tailNode
      tailNode.next = newNode
    } else {
      head = newNode
    }
    tail = newNode
  }

  // 6. Update the nodeAt function to return a node constrained to type T
  public func nodeAt(index: Int) -> Node<T>? {
    if index >= 0 {
      var node = head
      var i = index
      while node != nil {
        if i == 0 { return node }
        i -= 1
        node = node!.next
      }
    }
    return nil
  }

  public func removeAll() {
    head = nil
    tail = nil
  }

  // 7. Update the parameter of the remove function to take a node of type T. Update the return value to type T.
  public func remove(node: Node<T>) -> T {
    let prev = node.previous
    let next = node.next

    if let prev = prev {
      prev.next = next
    } else {
      head = next
    }
    next?.previous = prev

    if next == nil {
      tail = prev
    }

    node.previous = nil
    node.next = nil
    
    return node.value
  }
}

// 1
public class Node<T> {
  // 2
  var value: T
  var next: Node<T>?
  weak var previous: Node<T>?

  // 3
  init(value: T) {
    self.value = value
  }
}
