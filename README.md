# About

This repository contains schema generator for Cardano Query Layer CIP ([problem statement](https://github.com/cardano-foundation/CIPs/pull/625) / [WIP CIP PR](https://github.com/cardano-foundation/CIPs/pull/869)).

The specification is derived from [`spec.yaml`](./spec.yaml) using a [build script](./build.js).

# Getting started

1. Initialize the git submodule (optionally, update the CIPs repo submodule revision). You may have to add [this repo](https://github.com/klntsky/CIPs) as git remote if you are working with a feature branch.
2. Run `npm install`
3. Run `nodejs ./build.js`
