//
//  OFStream.m
//  TestProject
//
//  Created by Ian Oxborrow on 15/9/21.
//

//#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_REMAP_MODULE(ofstream, OFStream, NSObject)

  RCT_EXTERN_METHOD(exists: (NSString *)path
                    resolve: (RCTPromiseResolveBlock)resolve
                    rejecter:(RCTPromiseRejectBlock)reject
                    )

  RCT_EXTERN_METHOD(directoryExists: (NSString *)path
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

  RCT_EXTERN_METHOD(open: (NSString *)path
                    append: (BOOL *)append
                    resolve: (RCTPromiseResolveBlock)resolve
                    rejecter: (RCTPromiseRejectBlock)reject
                    )

  RCT_EXTERN_METHOD(write: (NSInteger *)streamIndex
                    text: (NSString *)text
                    )

  RCT_EXTERN_METHOD(writeOnce: (NSString *)path
                    append: (BOOL *)append
                    text: (NSString *)text
                    resolve: (RCTPromiseResolveBlock)resolve
                    rejecter: (RCTPromiseRejectBlock)reject
                    )

  RCT_EXTERN_METHOD(close: (NSInteger *)streamIndex
                    resolve: (RCTPromiseResolveBlock)resolve
                    rejecter:(RCTPromiseRejectBlock)reject
                    )

  RCT_EXTERN_METHOD(isOpen: (NSInteger *)streamIndex
                    resolve: (RCTPromiseResolveBlock)resolve
                    rejecter:(RCTPromiseRejectBlock)reject
                    )

  RCT_EXTERN_METHOD(read: (NSString *)path
                    resolve: (RCTPromiseResolveBlock)resolve
                    rejecter:(RCTPromiseRejectBlock)reject
                    )

  RCT_EXTERN_METHOD(delete: (NSString *)path
                    recursive: (BOOL *)recursive
                    resolve: (RCTPromiseResolveBlock)resolve
                    rejecter: (RCTPromiseRejectBlock)reject
                    )

  RCT_EXTERN_METHOD(mkdir: (NSString *)path
                    resolve: (RCTPromiseResolveBlock)resolve
                    rejecter: (RCTPromiseRejectBlock)reject
                    )

  RCT_EXTERN_METHOD(copyFile: (NSString *)origin
                    destination: (NSString *)destination
                    resolve: (RCTPromiseResolveBlock)resolve
                    rejecter: (RCTPromiseRejectBlock)reject
                    )
    
@end


/*
func open(path: String, append: Bool, _ resolve: RCTPromiseResolveBlock,
         rejecter reject: RCTPromiseRejectBlock) {
 //resolve promise
 resolve(streamIndex)
}

func write(streamIndex: Int, text: String) {

}

func writeOnce(path: String, append: Bool, text: String, _ resolve: RCTPromiseResolveBlock,
              rejecter reject: RCTPromiseRejectBlock) {
   resolve(nil)
}

func close(streamIndex: Int, _ resolve: RCTPromiseResolveBlock,
          rejecter reject: RCTPromiseRejectBlock) {
 resolve(nil)
}

func isOpen(streamIndex: Int, _ resolve: RCTPromiseResolveBlock,
           rejecter reject: RCTPromiseRejectBlock) {
   resolve(true)
 }
}

func read(path: String, _ resolve: RCTPromiseResolveBlock,
         rejecter reject: RCTPromiseRejectBlock) {
   resolve(fileText)
}

func delete(path: String, recursive: Bool, _ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {

 resolve(nil)
}
*/
