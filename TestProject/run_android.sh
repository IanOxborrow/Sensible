#!/bin/bash
set -m
sleep 5 && npx react-native run-android &
npm start &
fg
