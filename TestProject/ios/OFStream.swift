//
//  OFStream.swift
//  TestProject
//
//  Created by Ian Oxborrow on 15/9/21.
//

import Foundation
import React

@objc(OFStream)
class OFStream : NSObject {
  
  var outputStreams: [OutputStream?]
  //var isOpen: [Bool]
  let fileManager: FileManager

  override init () {
    self.outputStreams = []
    fileManager = FileManager.default
  }

  @objc
  func getName() -> String {
    return "ofstream"
  }

  @objc
  func exists(_ path: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    
    print("got to exists")
    
    //let fileManager = FileManager.default
    resolve(fileManager.fileExists(atPath: path))
  }
  
  @objc
  func directoryExists(_ directory: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    
    //let fileManager = FileManager.default
    var isDir : ObjCBool = false
    NSLog("we in the direoctry babes")

    if fileManager.fileExists(atPath: directory, isDirectory:&isDir) {
      resolve(true)
    } else {
      resolve(false)
    }
  }

  /**
   * Creates a new file stream (a buffered file stream) which can later be used
   * to write to a file
   *
   * @param path    The path of the file to write to
   * @param append  Whether to append to the file or to over-write the content
   * @param promise Returns the index of the stream (required to write to the
   *                file) if successful, otherwise returns an error
   */
  @objc
  func open(_ path: String, append: Bool, resolve: RCTPromiseResolveBlock,
            rejecter reject: RCTPromiseRejectBlock) {
    
    var streamIndex: Int = 1;
    
    let fileURL = URL(fileURLWithPath: path)
    
    if let outputStream = OutputStream(url: fileURL, append: append) {
        outputStream.open()
        
      streamIndex = outputStreams.count
      outputStreams.append(outputStream)
      //isOpen.append(true)
      
    } else {
        print("Unable to open file")
    }
    
    //resolve promise
    resolve(streamIndex)
  }

  /**
   * Write content to an already initialised file stream
   *
   * @param streamIndex The index of the file stream to write to
   * @param text        The content to write to file
   */
  @objc
  func write(_ streamIndex: Int, text: String) {
    //let outputStream = outputStreams[streamIndex]
    let bytesWritten = outputStreams[streamIndex]!.write(text)
  
    if bytesWritten < 0 {
      print("write failure")
    }
  }
  

  /**
   * @param path    The path of the file to write to
   * @param append  Whether to append to the file or to over-write the content
   * @param text    The content to write to file
   * @param promise Returns nothing on success, otherwise returns an error
   */
  @objc
  func writeOnce(_ path: String, append: Bool, text: String, resolve: RCTPromiseResolveBlock,
                 rejecter reject: RCTPromiseRejectBlock) {
    
    let fileURL = URL(fileURLWithPath: path)
    
    if let outputStream = OutputStream(url: fileURL, append: append) {
      outputStream.open()
      _ = outputStream.write(text)
      outputStream.close()
      resolve(nil)
    } else {
      print("Unable to open file")
    }
  }
  

  /**
   * Close an already opened file stream
   *
   * @param streamIndex The index of the file stream to close
   * @param promise     Returns nothing on success, otherwise returns an error
   */
  @objc
  func close(_ streamIndex: Int, resolve: RCTPromiseResolveBlock,
             rejecter reject: RCTPromiseRejectBlock) {
    outputStreams[streamIndex]!.close()
    // outputStreams.remove(at: streamIndex)
    outputStreams[streamIndex] = nil
    resolve(nil)
  }
  
  /**
   * Returns whether a file stream is currently opened or closed
   *
   * @param streamIndex The index of the file stream to check
   * @param promise     Returns whether the stream is opened or closed on success
   */
  @objc
  func isOpen(_ streamIndex: Int, resolve: RCTPromiseResolveBlock,
              rejecter reject: RCTPromiseRejectBlock) {
    if (streamIndex < 0 || streamIndex > outputStreams.count) {
      resolve(false)
    } else {
      //resolve(outputStreams[streamIndex] != nil)
      resolve(false)
    }
  }

  /**
   * Read the contents of a file. An empty string will be returned if the file does not exist
   *
   * @param path    The path of the file to read from
   * @param promise Returns the contents of the file on success, otherwise returns an error
   */
  @objc
  func read(_ path: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
     //this is the file. we will write to and read from it

    let fileURL = URL(fileURLWithPath: path)

    if (!fileManager.fileExists(atPath: path)) {
      resolve("")
      return
    }

    //reading
    do {
      let fileText = try String(contentsOf: fileURL, encoding: .utf8)
      resolve(fileText)
    }
    catch {
      resolve("error: file did not exist")
      // reject()
    }
  }
  
  /**
   * @param path      The path of the file or folder to delete
   * @param recursive True if a folder and it's contents are to be deleted
   * @param promise   Returns nothing on success, otherwise returns an error
   */
  @objc
  func delete(_ path: String, recursive: Bool, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    
    
    //let fileManager = FileManager.default
    
    //make sure the file exists
    if (!fileManager.fileExists(atPath: path)) {
      return
    }
    
    // make sure that the folder is meant to be recursivley deleted
    let fileURLs = try! fileManager.contentsOfDirectory(atPath: path)
    if (fileURLs.count == 0 && !recursive) {
      let _ = "[iOS] OFStream.delete: Received a folder with no recursive flag. Path: \(path)";
      
      //reject(error)
      return
    }
    
    // delete the file
    do {
      try fileManager.removeItem(atPath: path)
    } catch {
      let _ = "[iOS] OFStream.delete: Could not delete \(path)";
      //reject(error);
    }
    
    resolve(nil)
  }
    
  /**
   * Create a folder if it doesn't exist
   *
   * @param path    The path of the folder to create
   * @param promise Returns nothing on success, otherwise returns an error
   */
  @objc
  func mkdir(_ path: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    
    print("mkdir")
    print(path)
    //let fileManager = FileManager.default

    
    if (!fileManager.fileExists(atPath: path)) {
      
      do {
        try fileManager.createDirectory(atPath: path, withIntermediateDirectories: true, attributes: nil)
        //try "".write(to: fileURL, atomically: true, encoding: .utf8)
        NSLog("created directory \(path)")
      } catch {
        reject("[iOS] OFStream.mkdir: Could not create directory \(path)", "\(error)", nil)
      }
    } else {
      reject("[iOS] OFStream.mkdir: Could not create directory \(path)", "Path already existed", nil)
    }
  }


  /**
   * Create a folder if it doesn't exist
   *
   * @param path    The path of the folder to create
   * @param promise Returns nothing on success, otherwise returns an error
   */
  @objc
  func copyFile(_ origin: String, destination: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    
    //let fileManager = FileManager.default
  
    do {
      try fileManager.copyItem(atPath: origin, toPath: destination)
    } catch {
      NSLog("error copying file")
      NSLog("Error info: \(error)")
    }    
  }
}


extension OutputStream {

  /// Write `String` to `OutputStream`
  ///
  /// - parameter string:                The `String` to write.
  /// - parameter encoding:              The `String.Encoding` to use when writing the string. This will default to `.utf8`.
  /// - parameter allowLossyConversion:  Whether to permit lossy conversion when writing the string. Defaults to `false`.
  ///
  /// - returns:                         Return total number of bytes written upon success. Return `-1` upon failure.

  func write(_ string: String, encoding: String.Encoding = .utf8, allowLossyConversion: Bool = false) -> Int {

    if let data = string.data(using: encoding, allowLossyConversion: allowLossyConversion) {
      return data.withUnsafeBytes { (bytes: UnsafePointer<UInt8>) -> Int in
        var pointer = bytes
        var bytesRemaining = data.count
        var totalBytesWritten = 0

        while bytesRemaining > 0 {
          let bytesWritten = self.write(pointer, maxLength: bytesRemaining)
          if bytesWritten < 0 {
              return -1
          }

          bytesRemaining -= bytesWritten
          pointer += bytesWritten
          totalBytesWritten += bytesWritten
        }

        return totalBytesWritten
      }
    }

    return -1
  }

}

