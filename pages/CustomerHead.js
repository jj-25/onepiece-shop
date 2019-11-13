import React from "react";
import { Head } from "next/document";

export default class CustomHead extends Head {
  render() {
    const { styles } = this.context._documentProps;
    const children = this.props.children;
    return (
      <head>
        <title>惡魔果實</title>
        <meta name="viewport" content="width=1280" />
        <link href="https://fonts.googleapis.com/css?family=Noto+Sans+TC:300,400,500&display=swap&subset=chinese-traditional" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400&amp;display=swap" rel="stylesheet" />
        {this.getPreloadDynamicChunks()}
        {this.getPreloadMainLinks()}
        {children}
        {styles || null}
        <noscript id="insertion-point-jss" />
        {this.getCssLinks()}
      </head>
    );
  }
}
