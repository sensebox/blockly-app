#!/bin/bash
# expects travis env vars: $repo, $tag, $rev, $GITHUB_TOKEN

target=https://$GITHUB_TOKEN@github.com/sensebox/blockly-app.git
branch=fdroid

git clone --depth=1 -b $branch $target fdroid
rm -rf fdroid/*
mv -f platforms/android fdroid/
cd fdroid
git config user.name "Travis-CI"
git config user.email "travis@travis-ci.org"
git add -f --ignore-errors .
git commit -m "android project for $tag at $rev" --amend # dont add new commits to avoid increasing repo size
git push -f $target $branch > /dev/null 2>&1 # hide output to not leak GITHUB_TOKEN in logs
