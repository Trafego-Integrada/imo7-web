import { formatoData, formatoValor } from "@/helpers/helpers";
import pdf from "@/lib/pdf";
import prisma from "@/lib/prisma";

const Extrato = ({ extrato }) => {
    return (
        <>
            <div
                dangerouslySetInnerHTML={{
                    __html: `
                    <!doctype html>
                    <html lang="pt-BR">
                    <head>
                        <title>Extrato</title>
                        <meta charset="utf-8">
                        <style type="text/css" media="all">
                            html {
                                font-family: sans-serif;
                                -ms-text-size-adjust: 100%;
                                -webkit-text-size-adjust: 100%;
                            }
                    
                            body {
                                margin: 0;
                            }
                    
                            article,
                            aside,
                            details,
                            figcaption,
                            figure,
                            footer,
                            header,
                            hgroup,
                            main,
                            menu,
                            nav,
                            section,
                            summary {
                                display: block;
                            }
                    
                            audio,
                            canvas,
                            progress,
                            video {
                                display: inline-block;
                                vertical-align: baseline;
                            }
                    
                            audio:not([controls]) {
                                display: none;
                                height: 0;
                            }
                    
                            [hidden],
                            template {
                                display: none;
                            }
                    
                            a {
                                background-color: transparent;
                            }
                    
                            a:active,
                            a:hover {
                                outline: 0;
                            }
                    
                            abbr[title] {
                                border-bottom: 1px dotted;
                            }
                    
                            b,
                            strong {
                                font-weight: bold;
                            }
                    
                            dfn {
                                font-style: italic;
                            }
                    
                            h1 {
                                font-size: 2em;
                                margin: 0.67em 0;
                            }
                    
                            mark {
                                background: #ff0;
                                color: #000;
                            }
                    
                            small {
                                font-size: 80%;
                            }
                    
                            sub,
                            sup {
                                font-size: 75%;
                                line-height: 0;
                                position: relative;
                                vertical-align: baseline;
                            }
                    
                            sup {
                                top: -0.5em;
                            }
                    
                            sub {
                                bottom: -0.25em;
                            }
                    
                            img {
                                border: 0;
                            }
                    
                            svg:not(:root) {
                                overflow: hidden;
                            }
                    
                            figure {
                                margin: 1em 40px;
                            }
                    
                            hr {
                                -webkit-box-sizing: content-box;
                                -moz-box-sizing: content-box;
                                box-sizing: content-box;
                                height: 0;
                            }
                    
                            pre {
                                overflow: auto;
                            }
                    
                            code,
                            kbd,
                            pre,
                            samp {
                                font-family: monospace, monospace;
                                font-size: 1em;
                            }
                    
                            button,
                            input,
                            optgroup,
                            select,
                            textarea {
                                color: inherit;
                                font: inherit;
                                margin: 0;
                            }
                    
                            button {
                                overflow: visible;
                            }
                    
                            button,
                            select {
                                text-transform: none;
                            }
                    
                            button,
                            html input[type="button"],
                            input[type="reset"],
                            input[type="submit"] {
                                -webkit-appearance: button;
                                cursor: pointer;
                            }
                    
                            button[disabled],
                            html input[disabled] {
                                cursor: default;
                            }
                    
                            button::-moz-focus-inner,
                            input::-moz-focus-inner {
                                border: 0;
                                padding: 0;
                            }
                    
                            input {
                                line-height: normal;
                            }
                    
                            input[type="checkbox"],
                            input[type="radio"] {
                                -webkit-box-sizing: border-box;
                                -moz-box-sizing: border-box;
                                box-sizing: border-box;
                                padding: 0;
                            }
                    
                            input[type="number"]::-webkit-inner-spin-button,
                            input[type="number"]::-webkit-outer-spin-button {
                                height: auto;
                            }
                    
                            input[type="search"] {
                                -webkit-appearance: textfield;
                                -webkit-box-sizing: content-box;
                                -moz-box-sizing: content-box;
                                box-sizing: content-box;
                            }
                    
                            input[type="search"]::-webkit-search-cancel-button,
                            input[type="search"]::-webkit-search-decoration {
                                -webkit-appearance: none;
                            }
                    
                            fieldset {
                                border: 1px solid #c0c0c0;
                                margin: 0 2px;
                                padding: 0.35em 0.625em 0.75em;
                            }
                    
                            legend {
                                border: 0;
                                padding: 0;
                            }
                    
                            textarea {
                                overflow: auto;
                            }
                    
                            optgroup {
                                font-weight: bold;
                            }
                    
                            table {
                                border-collapse: collapse;
                                border-spacing: 0;
                            }
                    
                            td,
                            th {
                                padding: 0;
                            }
                    
                            /*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */
                            @media print {
                                *,
                                *:before,
                                *:after {
                                    background: transparent !important;
                                    color: #000 !important;
                                    -webkit-box-shadow: none !important;
                                    box-shadow: none !important;
                                    text-shadow: none !important;
                                }
                    
                                a,
                                a:visited {
                                    text-decoration: underline;
                                }
                    
                                a[href]:after {
                                    content: " (" attr(href) ")";
                                }
                    
                                abbr[title]:after {
                                    content: " (" attr(title) ")";
                                }
                    
                                a[href^="#"]:after,
                                a[href^="javascript:"]:after {
                                    content: "";
                                }
                    
                                pre,
                                blockquote {
                                    border: 1px solid #999;
                                    page-break-inside: avoid;
                                }
                    
                                thead {
                                    display: table-header-group;
                                }
                    
                                tr,
                                img {
                                    page-break-inside: avoid;
                                }
                    
                                img {
                                    max-width: 100% !important;
                                }
                    
                                p,
                                h2,
                                h3 {
                                    orphans: 3;
                                    widows: 3;
                                }
                    
                                h2,
                                h3 {
                                    page-break-after: avoid;
                                }
                    
                                .navbar {
                                    display: none;
                                }
                    
                                .btn > .caret,
                                .dropup > .btn > .caret {
                                    border-top-color: #000 !important;
                                }
                    
                                .label {
                                    border: 1px solid #000;
                                }
                    
                                .table {
                                    border-collapse: collapse !important;
                                }
                    
                                .table td,
                                .table th {
                                    background-color: #fff !important;
                                }
                    
                                .table-bordered th,
                                .table-bordered td {
                                    border: 1px solid #ddd !important;
                                }
                            }
                    
                            * {
                                -webkit-box-sizing: border-box;
                                -moz-box-sizing: border-box;
                                box-sizing: border-box;
                            }
                    
                            *:before,
                            *:after {
                                -webkit-box-sizing: border-box;
                                -moz-box-sizing: border-box;
                                box-sizing: border-box;
                            }
                    
                            html {
                                font-size: 10px;
                                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                            }
                    
                            body {
                                font-family: Helvetica, Arial, sans-serif;
                                font-size: 12px;
                                line-height: 1.42857143;
                                color: #333333;
                                background-color: #ffffff;
                            }
                    
                            input,
                            button,
                            select,
                            textarea {
                                font-family: inherit;
                                font-size: inherit;
                                line-height: inherit;
                            }
                    
                            a {
                                color: #006495;
                                text-decoration: none;
                            }
                    
                            a:hover,
                            a:focus {
                                color: #003048;
                                text-decoration: underline;
                            }
                    
                            a:focus {
                                outline: 5px auto -webkit-focus-ring-color;
                                outline-offset: -2px;
                            }
                    
                            figure {
                                margin: 0;
                            }
                    
                            img {
                                vertical-align: middle;
                            }
                    
                            .img-responsive {
                                display: block;
                                max-width: 100%;
                                height: auto;
                            }
                    
                            .img-rounded {
                                border-radius: 6px;
                            }
                    
                            .img-thumbnail {
                                padding: 4px;
                                line-height: 1.42857143;
                                background-color: #ffffff;
                                border: 1px solid #dddddd;
                                border-radius: 4px;
                                -webkit-transition: all 0.2s ease-in-out;
                                -o-transition: all 0.2s ease-in-out;
                                transition: all 0.2s ease-in-out;
                                display: inline-block;
                                max-width: 100%;
                                height: auto;
                            }
                    
                            .img-circle {
                                border-radius: 50%;
                            }
                    
                            hr {
                                margin-top: 20px;
                                margin-bottom: 20px;
                                border: 0;
                                border-top: 1px solid #eeeeee;
                            }
                    
                            .sr-only {
                                position: absolute;
                                width: 1px;
                                height: 1px;
                                margin: -1px;
                                padding: 0;
                                overflow: hidden;
                                clip: rect(0, 0, 0, 0);
                                border: 0;
                            }
                    
                            .sr-only-focusable:active,
                            .sr-only-focusable:focus {
                                position: static;
                                width: auto;
                                height: auto;
                                margin: 0;
                                overflow: visible;
                                clip: auto;
                            }
                    
                            [role="button"] {
                                cursor: pointer;
                            }
                    
                            code,
                            kbd,
                            pre,
                            samp {
                                font-family: Menlo, Monaco, Consolas, monospace;
                            }
                    
                            code {
                                padding: 2px 4px;
                                font-size: 90%;
                                color: #c7254e;
                                background-color: #f9f2f4;
                                border-radius: 4px;
                            }
                    
                            kbd {
                                padding: 2px 4px;
                                font-size: 90%;
                                color: #ffffff;
                                background-color: #333333;
                                border-radius: 3px;
                                -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25);
                                box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25);
                            }
                    
                            kbd kbd {
                                padding: 0;
                                font-size: 100%;
                                font-weight: bold;
                                -webkit-box-shadow: none;
                                box-shadow: none;
                            }
                    
                            pre {
                                display: block;
                                padding: 9.5px;
                                margin: 0 0 10px;
                                font-size: 13px;
                                line-height: 1.42857143;
                                word-break: break-all;
                                word-wrap: break-word;
                                color: #333333;
                                background-color: #f5f5f5;
                                border: 1px solid #cccccc;
                                border-radius: 4px;
                            }
                    
                            pre code {
                                padding: 0;
                                font-size: inherit;
                                color: inherit;
                                white-space: pre-wrap;
                                background-color: transparent;
                                border-radius: 0;
                            }
                    
                            .pre-scrollable {
                                max-height: 340px;
                                overflow-y: scroll;
                            }
                    
                            .container {
                                margin-right: auto;
                                margin-left: auto;
                                padding-left: 15px;
                                padding-right: 15px;
                            }
                    
                            @media (min-width: 768px) {
                                .container {
                                    width: 750px;
                                }
                            }
                    
                            @media (min-width: 992px) {
                                .container {
                                    width: 970px;
                                }
                            }
                    
                            @media (min-width: 1200px) {
                                .container {
                                    width: 1170px;
                                }
                            }
                    
                            .container-fluid {
                                margin-right: auto;
                                margin-left: auto;
                                padding-left: 15px;
                                padding-right: 15px;
                            }
                    
                            .row {
                                margin-left: -15px;
                                margin-right: -15px;
                            }
                    
                            .col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {
                                position: relative;
                                min-height: 1px;
                                padding-left: 15px;
                                padding-right: 15px;
                            }
                    
                            .col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {
                                float: left;
                            }
                    
                            .col-xs-12 {
                                width: 100%;
                            }
                    
                            .col-xs-11 {
                                width: 91.66666667%;
                            }
                    
                            .col-xs-10 {
                                width: 83.33333333%;
                            }
                    
                            .col-xs-9 {
                                width: 75%;
                            }
                    
                            .col-xs-8 {
                                width: 66.66666667%;
                            }
                    
                            .col-xs-7 {
                                width: 58.33333333%;
                            }
                    
                            .col-xs-6 {
                                width: 50%;
                            }
                    
                            .col-xs-5 {
                                width: 41.66666667%;
                            }
                    
                            .col-xs-4 {
                                width: 33.33333333%;
                            }
                    
                            .col-xs-3 {
                                width: 25%;
                            }
                    
                            .col-xs-2 {
                                width: 16.66666667%;
                            }
                    
                            .col-xs-1 {
                                width: 8.33333333%;
                            }
                    
                            .col-xs-pull-12 {
                                right: 100%;
                            }
                    
                            .col-xs-pull-11 {
                                right: 91.66666667%;
                            }
                    
                            .col-xs-pull-10 {
                                right: 83.33333333%;
                            }
                    
                            .col-xs-pull-9 {
                                right: 75%;
                            }
                    
                            .col-xs-pull-8 {
                                right: 66.66666667%;
                            }
                    
                            .col-xs-pull-7 {
                                right: 58.33333333%;
                            }
                    
                            .col-xs-pull-6 {
                                right: 50%;
                            }
                    
                            .col-xs-pull-5 {
                                right: 41.66666667%;
                            }
                    
                            .col-xs-pull-4 {
                                right: 33.33333333%;
                            }
                    
                            .col-xs-pull-3 {
                                right: 25%;
                            }
                    
                            .col-xs-pull-2 {
                                right: 16.66666667%;
                            }
                    
                            .col-xs-pull-1 {
                                right: 8.33333333%;
                            }
                    
                            .col-xs-pull-0 {
                                right: auto;
                            }
                    
                            .col-xs-push-12 {
                                left: 100%;
                            }
                    
                            .col-xs-push-11 {
                                left: 91.66666667%;
                            }
                    
                            .col-xs-push-10 {
                                left: 83.33333333%;
                            }
                    
                            .col-xs-push-9 {
                                left: 75%;
                            }
                    
                            .col-xs-push-8 {
                                left: 66.66666667%;
                            }
                    
                            .col-xs-push-7 {
                                left: 58.33333333%;
                            }
                    
                            .col-xs-push-6 {
                                left: 50%;
                            }
                    
                            .col-xs-push-5 {
                                left: 41.66666667%;
                            }
                    
                            .col-xs-push-4 {
                                left: 33.33333333%;
                            }
                    
                            .col-xs-push-3 {
                                left: 25%;
                            }
                    
                            .col-xs-push-2 {
                                left: 16.66666667%;
                            }
                    
                            .col-xs-push-1 {
                                left: 8.33333333%;
                            }
                    
                            .col-xs-push-0 {
                                left: auto;
                            }
                    
                            .col-xs-offset-12 {
                                margin-left: 100%;
                            }
                    
                            .col-xs-offset-11 {
                                margin-left: 91.66666667%;
                            }
                    
                            .col-xs-offset-10 {
                                margin-left: 83.33333333%;
                            }
                    
                            .col-xs-offset-9 {
                                margin-left: 75%;
                            }
                    
                            .col-xs-offset-8 {
                                margin-left: 66.66666667%;
                            }
                    
                            .col-xs-offset-7 {
                                margin-left: 58.33333333%;
                            }
                    
                            .col-xs-offset-6 {
                                margin-left: 50%;
                            }
                    
                            .col-xs-offset-5 {
                                margin-left: 41.66666667%;
                            }
                    
                            .col-xs-offset-4 {
                                margin-left: 33.33333333%;
                            }
                    
                            .col-xs-offset-3 {
                                margin-left: 25%;
                            }
                    
                            .col-xs-offset-2 {
                                margin-left: 16.66666667%;
                            }
                    
                            .col-xs-offset-1 {
                                margin-left: 8.33333333%;
                            }
                    
                            .col-xs-offset-0 {
                                margin-left: 0%;
                            }
                    
                            @media (min-width: 768px) {
                                .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {
                                    float: left;
                                }
                    
                                .col-sm-12 {
                                    width: 100%;
                                }
                    
                                .col-sm-11 {
                                    width: 91.66666667%;
                                }
                    
                                .col-sm-10 {
                                    width: 83.33333333%;
                                }
                    
                                .col-sm-9 {
                                    width: 75%;
                                }
                    
                                .col-sm-8 {
                                    width: 66.66666667%;
                                }
                    
                                .col-sm-7 {
                                    width: 58.33333333%;
                                }
                    
                                .col-sm-6 {
                                    width: 50%;
                                }
                    
                                .col-sm-5 {
                                    width: 41.66666667%;
                                }
                    
                                .col-sm-4 {
                                    width: 33.33333333%;
                                }
                    
                                .col-sm-3 {
                                    width: 25%;
                                }
                    
                                .col-sm-2 {
                                    width: 16.66666667%;
                                }
                    
                                .col-sm-1 {
                                    width: 8.33333333%;
                                }
                    
                                .col-sm-pull-12 {
                                    right: 100%;
                                }
                    
                                .col-sm-pull-11 {
                                    right: 91.66666667%;
                                }
                    
                                .col-sm-pull-10 {
                                    right: 83.33333333%;
                                }
                    
                                .col-sm-pull-9 {
                                    right: 75%;
                                }
                    
                                .col-sm-pull-8 {
                                    right: 66.66666667%;
                                }
                    
                                .col-sm-pull-7 {
                                    right: 58.33333333%;
                                }
                    
                                .col-sm-pull-6 {
                                    right: 50%;
                                }
                    
                                .col-sm-pull-5 {
                                    right: 41.66666667%;
                                }
                    
                                .col-sm-pull-4 {
                                    right: 33.33333333%;
                                }
                    
                                .col-sm-pull-3 {
                                    right: 25%;
                                }
                    
                                .col-sm-pull-2 {
                                    right: 16.66666667%;
                                }
                    
                                .col-sm-pull-1 {
                                    right: 8.33333333%;
                                }
                    
                                .col-sm-pull-0 {
                                    right: auto;
                                }
                    
                                .col-sm-push-12 {
                                    left: 100%;
                                }
                    
                                .col-sm-push-11 {
                                    left: 91.66666667%;
                                }
                    
                                .col-sm-push-10 {
                                    left: 83.33333333%;
                                }
                    
                                .col-sm-push-9 {
                                    left: 75%;
                                }
                    
                                .col-sm-push-8 {
                                    left: 66.66666667%;
                                }
                    
                                .col-sm-push-7 {
                                    left: 58.33333333%;
                                }
                    
                                .col-sm-push-6 {
                                    left: 50%;
                                }
                    
                                .col-sm-push-5 {
                                    left: 41.66666667%;
                                }
                    
                                .col-sm-push-4 {
                                    left: 33.33333333%;
                                }
                    
                                .col-sm-push-3 {
                                    left: 25%;
                                }
                    
                                .col-sm-push-2 {
                                    left: 16.66666667%;
                                }
                    
                                .col-sm-push-1 {
                                    left: 8.33333333%;
                                }
                    
                                .col-sm-push-0 {
                                    left: auto;
                                }
                    
                                .col-sm-offset-12 {
                                    margin-left: 100%;
                                }
                    
                                .col-sm-offset-11 {
                                    margin-left: 91.66666667%;
                                }
                    
                                .col-sm-offset-10 {
                                    margin-left: 83.33333333%;
                                }
                    
                                .col-sm-offset-9 {
                                    margin-left: 75%;
                                }
                    
                                .col-sm-offset-8 {
                                    margin-left: 66.66666667%;
                                }
                    
                                .col-sm-offset-7 {
                                    margin-left: 58.33333333%;
                                }
                    
                                .col-sm-offset-6 {
                                    margin-left: 50%;
                                }
                    
                                .col-sm-offset-5 {
                                    margin-left: 41.66666667%;
                                }
                    
                                .col-sm-offset-4 {
                                    margin-left: 33.33333333%;
                                }
                    
                                .col-sm-offset-3 {
                                    margin-left: 25%;
                                }
                    
                                .col-sm-offset-2 {
                                    margin-left: 16.66666667%;
                                }
                    
                                .col-sm-offset-1 {
                                    margin-left: 8.33333333%;
                                }
                    
                                .col-sm-offset-0 {
                                    margin-left: 0%;
                                }
                            }
                    
                            @media (min-width: 992px) {
                                .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {
                                    float: left;
                                }
                    
                                .col-md-12 {
                                    width: 100%;
                                }
                    
                                .col-md-11 {
                                    width: 91.66666667%;
                                }
                    
                                .col-md-10 {
                                    width: 83.33333333%;
                                }
                    
                                .col-md-9 {
                                    width: 75%;
                                }
                    
                                .col-md-8 {
                                    width: 66.66666667%;
                                }
                    
                                .col-md-7 {
                                    width: 58.33333333%;
                                }
                    
                                .col-md-6 {
                                    width: 50%;
                                }
                    
                                .col-md-5 {
                                    width: 41.66666667%;
                                }
                    
                                .col-md-4 {
                                    width: 33.33333333%;
                                }
                    
                                .col-md-3 {
                                    width: 25%;
                                }
                    
                                .col-md-2 {
                                    width: 16.66666667%;
                                }
                    
                                .col-md-1 {
                                    width: 8.33333333%;
                                }
                    
                                .col-md-pull-12 {
                                    right: 100%;
                                }
                    
                                .col-md-pull-11 {
                                    right: 91.66666667%;
                                }
                    
                                .col-md-pull-10 {
                                    right: 83.33333333%;
                                }
                    
                                .col-md-pull-9 {
                                    right: 75%;
                                }
                    
                                .col-md-pull-8 {
                                    right: 66.66666667%;
                                }
                    
                                .col-md-pull-7 {
                                    right: 58.33333333%;
                                }
                    
                                .col-md-pull-6 {
                                    right: 50%;
                                }
                    
                                .col-md-pull-5 {
                                    right: 41.66666667%;
                                }
                    
                                .col-md-pull-4 {
                                    right: 33.33333333%;
                                }
                    
                                .col-md-pull-3 {
                                    right: 25%;
                                }
                    
                                .col-md-pull-2 {
                                    right: 16.66666667%;
                                }
                    
                                .col-md-pull-1 {
                                    right: 8.33333333%;
                                }
                    
                                .col-md-pull-0 {
                                    right: auto;
                                }
                    
                                .col-md-push-12 {
                                    left: 100%;
                                }
                    
                                .col-md-push-11 {
                                    left: 91.66666667%;
                                }
                    
                                .col-md-push-10 {
                                    left: 83.33333333%;
                                }
                    
                                .col-md-push-9 {
                                    left: 75%;
                                }
                    
                                .col-md-push-8 {
                                    left: 66.66666667%;
                                }
                    
                                .col-md-push-7 {
                                    left: 58.33333333%;
                                }
                    
                                .col-md-push-6 {
                                    left: 50%;
                                }
                    
                                .col-md-push-5 {
                                    left: 41.66666667%;
                                }
                    
                                .col-md-push-4 {
                                    left: 33.33333333%;
                                }
                    
                                .col-md-push-3 {
                                    left: 25%;
                                }
                    
                                .col-md-push-2 {
                                    left: 16.66666667%;
                                }
                    
                                .col-md-push-1 {
                                    left: 8.33333333%;
                                }
                    
                                .col-md-push-0 {
                                    left: auto;
                                }
                    
                                .col-md-offset-12 {
                                    margin-left: 100%;
                                }
                    
                                .col-md-offset-11 {
                                    margin-left: 91.66666667%;
                                }
                    
                                .col-md-offset-10 {
                                    margin-left: 83.33333333%;
                                }
                    
                                .col-md-offset-9 {
                                    margin-left: 75%;
                                }
                    
                                .col-md-offset-8 {
                                    margin-left: 66.66666667%;
                                }
                    
                                .col-md-offset-7 {
                                    margin-left: 58.33333333%;
                                }
                    
                                .col-md-offset-6 {
                                    margin-left: 50%;
                                }
                    
                                .col-md-offset-5 {
                                    margin-left: 41.66666667%;
                                }
                    
                                .col-md-offset-4 {
                                    margin-left: 33.33333333%;
                                }
                    
                                .col-md-offset-3 {
                                    margin-left: 25%;
                                }
                    
                                .col-md-offset-2 {
                                    margin-left: 16.66666667%;
                                }
                    
                                .col-md-offset-1 {
                                    margin-left: 8.33333333%;
                                }
                    
                                .col-md-offset-0 {
                                    margin-left: 0%;
                                }
                            }
                    
                            @media (min-width: 1200px) {
                                .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {
                                    float: left;
                                }
                    
                                .col-lg-12 {
                                    width: 100%;
                                }
                    
                                .col-lg-11 {
                                    width: 91.66666667%;
                                }
                    
                                .col-lg-10 {
                                    width: 83.33333333%;
                                }
                    
                                .col-lg-9 {
                                    width: 75%;
                                }
                    
                                .col-lg-8 {
                                    width: 66.66666667%;
                                }
                    
                                .col-lg-7 {
                                    width: 58.33333333%;
                                }
                    
                                .col-lg-6 {
                                    width: 50%;
                                }
                    
                                .col-lg-5 {
                                    width: 41.66666667%;
                                }
                    
                                .col-lg-4 {
                                    width: 33.33333333%;
                                }
                    
                                .col-lg-3 {
                                    width: 25%;
                                }
                    
                                .col-lg-2 {
                                    width: 16.66666667%;
                                }
                    
                                .col-lg-1 {
                                    width: 8.33333333%;
                                }
                    
                                .col-lg-pull-12 {
                                    right: 100%;
                                }
                    
                                .col-lg-pull-11 {
                                    right: 91.66666667%;
                                }
                    
                                .col-lg-pull-10 {
                                    right: 83.33333333%;
                                }
                    
                                .col-lg-pull-9 {
                                    right: 75%;
                                }
                    
                                .col-lg-pull-8 {
                                    right: 66.66666667%;
                                }
                    
                                .col-lg-pull-7 {
                                    right: 58.33333333%;
                                }
                    
                                .col-lg-pull-6 {
                                    right: 50%;
                                }
                    
                                .col-lg-pull-5 {
                                    right: 41.66666667%;
                                }
                    
                                .col-lg-pull-4 {
                                    right: 33.33333333%;
                                }
                    
                                .col-lg-pull-3 {
                                    right: 25%;
                                }
                    
                                .col-lg-pull-2 {
                                    right: 16.66666667%;
                                }
                    
                                .col-lg-pull-1 {
                                    right: 8.33333333%;
                                }
                    
                                .col-lg-pull-0 {
                                    right: auto;
                                }
                    
                                .col-lg-push-12 {
                                    left: 100%;
                                }
                    
                                .col-lg-push-11 {
                                    left: 91.66666667%;
                                }
                    
                                .col-lg-push-10 {
                                    left: 83.33333333%;
                                }
                    
                                .col-lg-push-9 {
                                    left: 75%;
                                }
                    
                                .col-lg-push-8 {
                                    left: 66.66666667%;
                                }
                    
                                .col-lg-push-7 {
                                    left: 58.33333333%;
                                }
                    
                                .col-lg-push-6 {
                                    left: 50%;
                                }
                    
                                .col-lg-push-5 {
                                    left: 41.66666667%;
                                }
                    
                                .col-lg-push-4 {
                                    left: 33.33333333%;
                                }
                    
                                .col-lg-push-3 {
                                    left: 25%;
                                }
                    
                                .col-lg-push-2 {
                                    left: 16.66666667%;
                                }
                    
                                .col-lg-push-1 {
                                    left: 8.33333333%;
                                }
                    
                                .col-lg-push-0 {
                                    left: auto;
                                }
                    
                                .col-lg-offset-12 {
                                    margin-left: 100%;
                                }
                    
                                .col-lg-offset-11 {
                                    margin-left: 91.66666667%;
                                }
                    
                                .col-lg-offset-10 {
                                    margin-left: 83.33333333%;
                                }
                    
                                .col-lg-offset-9 {
                                    margin-left: 75%;
                                }
                    
                                .col-lg-offset-8 {
                                    margin-left: 66.66666667%;
                                }
                    
                                .col-lg-offset-7 {
                                    margin-left: 58.33333333%;
                                }
                    
                                .col-lg-offset-6 {
                                    margin-left: 50%;
                                }
                    
                                .col-lg-offset-5 {
                                    margin-left: 41.66666667%;
                                }
                    
                                .col-lg-offset-4 {
                                    margin-left: 33.33333333%;
                                }
                    
                                .col-lg-offset-3 {
                                    margin-left: 25%;
                                }
                    
                                .col-lg-offset-2 {
                                    margin-left: 16.66666667%;
                                }
                    
                                .col-lg-offset-1 {
                                    margin-left: 8.33333333%;
                                }
                    
                                .col-lg-offset-0 {
                                    margin-left: 0%;
                                }
                            }
                    
                            table {
                                background-color: transparent;
                            }
                    
                            caption {
                                padding-top: 8px;
                                padding-bottom: 8px;
                                color: #777777;
                                text-align: left;
                            }
                    
                            th {
                                text-align: left;
                            }
                    
                            .table {
                                width: 100%;
                                max-width: 100%;
                                margin-bottom: 20px;
                            }
                    
                            .table > thead > tr > th,
                            .table > tbody > tr > th,
                            .table > tfoot > tr > th,
                            .table > thead > tr > td,
                            .table > tbody > tr > td,
                            .table > tfoot > tr > td {
                                padding: 8px;
                                line-height: 1.42857143;
                                vertical-align: top;
                                border-top: 1px solid #dddddd;
                            }
                    
                            .table > thead > tr > th {
                                vertical-align: bottom;
                                border-bottom: 2px solid #dddddd;
                            }
                    
                            .table > caption + thead > tr:first-child > th,
                            .table > colgroup + thead > tr:first-child > th,
                            .table > thead:first-child > tr:first-child > th,
                            .table > caption + thead > tr:first-child > td,
                            .table > colgroup + thead > tr:first-child > td,
                            .table > thead:first-child > tr:first-child > td {
                                border-top: 0;
                            }
                    
                            .table > tbody + tbody {
                                border-top: 2px solid #dddddd;
                            }
                    
                            .table .table {
                                background-color: #ffffff;
                            }
                    
                            .table-condensed > thead > tr > th,
                            .table-condensed > tbody > tr > th,
                            .table-condensed > tfoot > tr > th,
                            .table-condensed > thead > tr > td,
                            .table-condensed > tbody > tr > td,
                            .table-condensed > tfoot > tr > td {
                                padding: 5px;
                            }
                    
                            .table-bordered {
                                border: 1px solid #dddddd;
                            }
                    
                            .table-bordered > thead > tr > th,
                            .table-bordered > tbody > tr > th,
                            .table-bordered > tfoot > tr > th,
                            .table-bordered > thead > tr > td,
                            .table-bordered > tbody > tr > td,
                            .table-bordered > tfoot > tr > td {
                                border: 1px solid #dddddd;
                            }
                    
                            .table-bordered > thead > tr > th,
                            .table-bordered > thead > tr > td {
                                border-bottom-width: 2px;
                            }
                    
                            .table-striped > tbody > tr:nth-of-type(odd) {
                                background-color: #f9f9f9;
                            }
                    
                            .table-hover > tbody > tr:hover {
                                background-color: #f5f5f5;
                            }
                    
                            table col[class*="col-"] {
                                position: static;
                                float: none;
                                display: table-column;
                            }
                    
                            table td[class*="col-"],
                            table th[class*="col-"] {
                                position: static;
                                float: none;
                                display: table-cell;
                            }
                    
                            .table > thead > tr > td.active,
                            .table > tbody > tr > td.active,
                            .table > tfoot > tr > td.active,
                            .table > thead > tr > th.active,
                            .table > tbody > tr > th.active,
                            .table > tfoot > tr > th.active,
                            .table > thead > tr.active > td,
                            .table > tbody > tr.active > td,
                            .table > tfoot > tr.active > td,
                            .table > thead > tr.active > th,
                            .table > tbody > tr.active > th,
                            .table > tfoot > tr.active > th {
                                background-color: #f5f5f5;
                            }
                    
                            .table-hover > tbody > tr > td.active:hover,
                            .table-hover > tbody > tr > th.active:hover,
                            .table-hover > tbody > tr.active:hover > td,
                            .table-hover > tbody > tr:hover > .active,
                            .table-hover > tbody > tr.active:hover > th {
                                background-color: #e8e8e8;
                            }
                    
                            .table > thead > tr > td.success,
                            .table > tbody > tr > td.success,
                            .table > tfoot > tr > td.success,
                            .table > thead > tr > th.success,
                            .table > tbody > tr > th.success,
                            .table > tfoot > tr > th.success,
                            .table > thead > tr.success > td,
                            .table > tbody > tr.success > td,
                            .table > tfoot > tr.success > td,
                            .table > thead > tr.success > th,
                            .table > tbody > tr.success > th,
                            .table > tfoot > tr.success > th {
                                background-color: #dff0d8;
                            }
                    
                            .table-hover > tbody > tr > td.success:hover,
                            .table-hover > tbody > tr > th.success:hover,
                            .table-hover > tbody > tr.success:hover > td,
                            .table-hover > tbody > tr:hover > .success,
                            .table-hover > tbody > tr.success:hover > th {
                                background-color: #d0e9c6;
                            }
                    
                            .table > thead > tr > td.info,
                            .table > tbody > tr > td.info,
                            .table > tfoot > tr > td.info,
                            .table > thead > tr > th.info,
                            .table > tbody > tr > th.info,
                            .table > tfoot > tr > th.info,
                            .table > thead > tr.info > td,
                            .table > tbody > tr.info > td,
                            .table > tfoot > tr.info > td,
                            .table > thead > tr.info > th,
                            .table > tbody > tr.info > th,
                            .table > tfoot > tr.info > th {
                                background-color: #d9edf7;
                            }
                    
                            .table-hover > tbody > tr > td.info:hover,
                            .table-hover > tbody > tr > th.info:hover,
                            .table-hover > tbody > tr.info:hover > td,
                            .table-hover > tbody > tr:hover > .info,
                            .table-hover > tbody > tr.info:hover > th {
                                background-color: #c4e3f3;
                            }
                    
                            .table > thead > tr > td.warning,
                            .table > tbody > tr > td.warning,
                            .table > tfoot > tr > td.warning,
                            .table > thead > tr > th.warning,
                            .table > tbody > tr > th.warning,
                            .table > tfoot > tr > th.warning,
                            .table > thead > tr.warning > td,
                            .table > tbody > tr.warning > td,
                            .table > tfoot > tr.warning > td,
                            .table > thead > tr.warning > th,
                            .table > tbody > tr.warning > th,
                            .table > tfoot > tr.warning > th {
                                background-color: #fcf8e3;
                            }
                    
                            .table-hover > tbody > tr > td.warning:hover,
                            .table-hover > tbody > tr > th.warning:hover,
                            .table-hover > tbody > tr.warning:hover > td,
                            .table-hover > tbody > tr:hover > .warning,
                            .table-hover > tbody > tr.warning:hover > th {
                                background-color: #faf2cc;
                            }
                    
                            .table > thead > tr > td.danger,
                            .table > tbody > tr > td.danger,
                            .table > tfoot > tr > td.danger,
                            .table > thead > tr > th.danger,
                            .table > tbody > tr > th.danger,
                            .table > tfoot > tr > th.danger,
                            .table > thead > tr.danger > td,
                            .table > tbody > tr.danger > td,
                            .table > tfoot > tr.danger > td,
                            .table > thead > tr.danger > th,
                            .table > tbody > tr.danger > th,
                            .table > tfoot > tr.danger > th {
                                background-color: #f2dede;
                            }
                    
                            .table-hover > tbody > tr > td.danger:hover,
                            .table-hover > tbody > tr > th.danger:hover,
                            .table-hover > tbody > tr.danger:hover > td,
                            .table-hover > tbody > tr:hover > .danger,
                            .table-hover > tbody > tr.danger:hover > th {
                                background-color: #ebcccc;
                            }
                    
                            .table-responsive {
                                overflow-x: auto;
                                min-height: 0.01%;
                            }
                    
                            @media screen and (max-width: 767px) {
                                .table-responsive {
                                    width: 100%;
                                    margin-bottom: 15px;
                                    overflow-y: hidden;
                                    -ms-overflow-style: -ms-autohiding-scrollbar;
                                    border: 1px solid #dddddd;
                                }
                    
                                .table-responsive > .table {
                                    margin-bottom: 0;
                                }
                    
                                .table-responsive > .table > thead > tr > th,
                                .table-responsive > .table > tbody > tr > th,
                                .table-responsive > .table > tfoot > tr > th,
                                .table-responsive > .table > thead > tr > td,
                                .table-responsive > .table > tbody > tr > td,
                                .table-responsive > .table > tfoot > tr > td {
                                    white-space: nowrap;
                                }
                    
                                .table-responsive > .table-bordered {
                                    border: 0;
                                }
                    
                                .table-responsive > .table-bordered > thead > tr > th:first-child,
                                .table-responsive > .table-bordered > tbody > tr > th:first-child,
                                .table-responsive > .table-bordered > tfoot > tr > th:first-child,
                                .table-responsive > .table-bordered > thead > tr > td:first-child,
                                .table-responsive > .table-bordered > tbody > tr > td:first-child,
                                .table-responsive > .table-bordered > tfoot > tr > td:first-child {
                                    border-left: 0;
                                }
                    
                                .table-responsive > .table-bordered > thead > tr > th:last-child,
                                .table-responsive > .table-bordered > tbody > tr > th:last-child,
                                .table-responsive > .table-bordered > tfoot > tr > th:last-child,
                                .table-responsive > .table-bordered > thead > tr > td:last-child,
                                .table-responsive > .table-bordered > tbody > tr > td:last-child,
                                .table-responsive > .table-bordered > tfoot > tr > td:last-child {
                                    border-right: 0;
                                }
                    
                                .table-responsive > .table-bordered > tbody > tr:last-child > th,
                                .table-responsive > .table-bordered > tfoot > tr:last-child > th,
                                .table-responsive > .table-bordered > tbody > tr:last-child > td,
                                .table-responsive > .table-bordered > tfoot > tr:last-child > td {
                                    border-bottom: 0;
                                }
                            }
                    
                            .btn {
                                display: inline-block;
                                margin-bottom: 0;
                                font-weight: normal;
                                text-align: center;
                                vertical-align: middle;
                                -ms-touch-action: manipulation;
                                touch-action: manipulation;
                                cursor: pointer;
                                background-image: none;
                                border: 1px solid transparent;
                                white-space: nowrap;
                                padding: 6px 12px;
                                font-size: 14px;
                                line-height: 1.42857143;
                                border-radius: 4px;
                                -webkit-user-select: none;
                                -moz-user-select: none;
                                -ms-user-select: none;
                                user-select: none;
                            }
                    
                            .btn:focus,
                            .btn:active:focus,
                            .btn.active:focus,
                            .btn.focus,
                            .btn:active.focus,
                            .btn.active.focus {
                                outline: 5px auto -webkit-focus-ring-color;
                                outline-offset: -2px;
                            }
                    
                            .btn:hover,
                            .btn:focus,
                            .btn.focus {
                                color: #333333;
                                text-decoration: none;
                            }
                    
                            .btn:active,
                            .btn.active {
                                outline: 0;
                                background-image: none;
                                -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
                                box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
                            }
                    
                            .btn.disabled,
                            .btn[disabled],
                            fieldset[disabled] .btn {
                                cursor: not-allowed;
                                opacity: 0.65;
                                filter: alpha(opacity=65);
                                -webkit-box-shadow: none;
                                box-shadow: none;
                            }
                    
                            a.btn.disabled,
                            fieldset[disabled] a.btn {
                                pointer-events: none;
                            }
                    
                            .btn-default {
                                color: #333333;
                                background-color: #ffffff;
                                border-color: #cccccc;
                            }
                    
                            .btn-default:focus,
                            .btn-default.focus {
                                color: #333333;
                                background-color: #e6e6e6;
                                border-color: #8c8c8c;
                            }
                    
                            .btn-default:hover {
                                color: #333333;
                                background-color: #e6e6e6;
                                border-color: #adadad;
                            }
                    
                            .btn-default:active,
                            .btn-default.active,
                            .open > .dropdown-toggle.btn-default {
                                color: #333333;
                                background-color: #e6e6e6;
                                border-color: #adadad;
                            }
                    
                            .btn-default:active:hover,
                            .btn-default.active:hover,
                            .open > .dropdown-toggle.btn-default:hover,
                            .btn-default:active:focus,
                            .btn-default.active:focus,
                            .open > .dropdown-toggle.btn-default:focus,
                            .btn-default:active.focus,
                            .btn-default.active.focus,
                            .open > .dropdown-toggle.btn-default.focus {
                                color: #333333;
                                background-color: #d4d4d4;
                                border-color: #8c8c8c;
                            }
                    
                            .btn-default:active,
                            .btn-default.active,
                            .open > .dropdown-toggle.btn-default {
                                background-image: none;
                            }
                    
                            .btn-default.disabled:hover,
                            .btn-default[disabled]:hover,
                            fieldset[disabled] .btn-default:hover,
                            .btn-default.disabled:focus,
                            .btn-default[disabled]:focus,
                            fieldset[disabled] .btn-default:focus,
                            .btn-default.disabled.focus,
                            .btn-default[disabled].focus,
                            fieldset[disabled] .btn-default.focus {
                                background-color: #ffffff;
                                border-color: #cccccc;
                            }
                    
                            .btn-default .badge {
                                color: #ffffff;
                                background-color: #333333;
                            }
                    
                            .btn-primary {
                                color: #ffffff;
                                background-color: #006495;
                                border-color: #00537b;
                            }
                    
                            .btn-primary:focus,
                            .btn-primary.focus {
                                color: #ffffff;
                                background-color: #004262;
                                border-color: #000000;
                            }
                    
                            .btn-primary:hover {
                                color: #ffffff;
                                background-color: #004262;
                                border-color: #002a3e;
                            }
                    
                            .btn-primary:active,
                            .btn-primary.active,
                            .open > .dropdown-toggle.btn-primary {
                                color: #ffffff;
                                background-color: #004262;
                                border-color: #002a3e;
                            }
                    
                            .btn-primary:active:hover,
                            .btn-primary.active:hover,
                            .open > .dropdown-toggle.btn-primary:hover,
                            .btn-primary:active:focus,
                            .btn-primary.active:focus,
                            .open > .dropdown-toggle.btn-primary:focus,
                            .btn-primary:active.focus,
                            .btn-primary.active.focus,
                            .open > .dropdown-toggle.btn-primary.focus {
                                color: #ffffff;
                                background-color: #002a3e;
                                border-color: #000000;
                            }
                    
                            .btn-primary:active,
                            .btn-primary.active,
                            .open > .dropdown-toggle.btn-primary {
                                background-image: none;
                            }
                    
                            .btn-primary.disabled:hover,
                            .btn-primary[disabled]:hover,
                            fieldset[disabled] .btn-primary:hover,
                            .btn-primary.disabled:focus,
                            .btn-primary[disabled]:focus,
                            fieldset[disabled] .btn-primary:focus,
                            .btn-primary.disabled.focus,
                            .btn-primary[disabled].focus,
                            fieldset[disabled] .btn-primary.focus {
                                background-color: #006495;
                                border-color: #00537b;
                            }
                    
                            .btn-primary .badge {
                                color: #006495;
                                background-color: #ffffff;
                            }
                    
                            .btn-success {
                                color: #ffffff;
                                background-color: #5cb85c;
                                border-color: #4cae4c;
                            }
                    
                            .btn-success:focus,
                            .btn-success.focus {
                                color: #ffffff;
                                background-color: #449d44;
                                border-color: #255625;
                            }
                    
                            .btn-success:hover {
                                color: #ffffff;
                                background-color: #449d44;
                                border-color: #398439;
                            }
                    
                            .btn-success:active,
                            .btn-success.active,
                            .open > .dropdown-toggle.btn-success {
                                color: #ffffff;
                                background-color: #449d44;
                                border-color: #398439;
                            }
                    
                            .btn-success:active:hover,
                            .btn-success.active:hover,
                            .open > .dropdown-toggle.btn-success:hover,
                            .btn-success:active:focus,
                            .btn-success.active:focus,
                            .open > .dropdown-toggle.btn-success:focus,
                            .btn-success:active.focus,
                            .btn-success.active.focus,
                            .open > .dropdown-toggle.btn-success.focus {
                                color: #ffffff;
                                background-color: #398439;
                                border-color: #255625;
                            }
                    
                            .btn-success:active,
                            .btn-success.active,
                            .open > .dropdown-toggle.btn-success {
                                background-image: none;
                            }
                    
                            .btn-success.disabled:hover,
                            .btn-success[disabled]:hover,
                            fieldset[disabled] .btn-success:hover,
                            .btn-success.disabled:focus,
                            .btn-success[disabled]:focus,
                            fieldset[disabled] .btn-success:focus,
                            .btn-success.disabled.focus,
                            .btn-success[disabled].focus,
                            fieldset[disabled] .btn-success.focus {
                                background-color: #5cb85c;
                                border-color: #4cae4c;
                            }
                    
                            .btn-success .badge {
                                color: #5cb85c;
                                background-color: #ffffff;
                            }
                    
                            .btn-info {
                                color: #ffffff;
                                background-color: #5bc0de;
                                border-color: #46b8da;
                            }
                    
                            .btn-info:focus,
                            .btn-info.focus {
                                color: #ffffff;
                                background-color: #31b0d5;
                                border-color: #1b6d85;
                            }
                    
                            .btn-info:hover {
                                color: #ffffff;
                                background-color: #31b0d5;
                                border-color: #269abc;
                            }
                    
                            .btn-info:active,
                            .btn-info.active,
                            .open > .dropdown-toggle.btn-info {
                                color: #ffffff;
                                background-color: #31b0d5;
                                border-color: #269abc;
                            }
                    
                            .btn-info:active:hover,
                            .btn-info.active:hover,
                            .open > .dropdown-toggle.btn-info:hover,
                            .btn-info:active:focus,
                            .btn-info.active:focus,
                            .open > .dropdown-toggle.btn-info:focus,
                            .btn-info:active.focus,
                            .btn-info.active.focus,
                            .open > .dropdown-toggle.btn-info.focus {
                                color: #ffffff;
                                background-color: #269abc;
                                border-color: #1b6d85;
                            }
                    
                            .btn-info:active,
                            .btn-info.active,
                            .open > .dropdown-toggle.btn-info {
                                background-image: none;
                            }
                    
                            .btn-info.disabled:hover,
                            .btn-info[disabled]:hover,
                            fieldset[disabled] .btn-info:hover,
                            .btn-info.disabled:focus,
                            .btn-info[disabled]:focus,
                            fieldset[disabled] .btn-info:focus,
                            .btn-info.disabled.focus,
                            .btn-info[disabled].focus,
                            fieldset[disabled] .btn-info.focus {
                                background-color: #5bc0de;
                                border-color: #46b8da;
                            }
                    
                            .btn-info .badge {
                                color: #5bc0de;
                                background-color: #ffffff;
                            }
                    
                            .btn-warning {
                                color: #ffffff;
                                background-color: #ffab40;
                                border-color: #ffa026;
                            }
                    
                            .btn-warning:focus,
                            .btn-warning.focus {
                                color: #ffffff;
                                background-color: #ff950d;
                                border-color: #a65d00;
                            }
                    
                            .btn-warning:hover {
                                color: #ffffff;
                                background-color: #ff950d;
                                border-color: #e88200;
                            }
                    
                            .btn-warning:active,
                            .btn-warning.active,
                            .open > .dropdown-toggle.btn-warning {
                                color: #ffffff;
                                background-color: #ff950d;
                                border-color: #e88200;
                            }
                    
                            .btn-warning:active:hover,
                            .btn-warning.active:hover,
                            .open > .dropdown-toggle.btn-warning:hover,
                            .btn-warning:active:focus,
                            .btn-warning.active:focus,
                            .open > .dropdown-toggle.btn-warning:focus,
                            .btn-warning:active.focus,
                            .btn-warning.active.focus,
                            .open > .dropdown-toggle.btn-warning.focus {
                                color: #ffffff;
                                background-color: #e88200;
                                border-color: #a65d00;
                            }
                    
                            .btn-warning:active,
                            .btn-warning.active,
                            .open > .dropdown-toggle.btn-warning {
                                background-image: none;
                            }
                    
                            .btn-warning.disabled:hover,
                            .btn-warning[disabled]:hover,
                            fieldset[disabled] .btn-warning:hover,
                            .btn-warning.disabled:focus,
                            .btn-warning[disabled]:focus,
                            fieldset[disabled] .btn-warning:focus,
                            .btn-warning.disabled.focus,
                            .btn-warning[disabled].focus,
                            fieldset[disabled] .btn-warning.focus {
                                background-color: #ffab40;
                                border-color: #ffa026;
                            }
                    
                            .btn-warning .badge {
                                color: #ffab40;
                                background-color: #ffffff;
                            }
                    
                            .btn-danger {
                                color: #ffffff;
                                background-color: #d9534f;
                                border-color: #d43f3a;
                            }
                    
                            .btn-danger:focus,
                            .btn-danger.focus {
                                color: #ffffff;
                                background-color: #c9302c;
                                border-color: #761c19;
                            }
                    
                            .btn-danger:hover {
                                color: #ffffff;
                                background-color: #c9302c;
                                border-color: #ac2925;
                            }
                    
                            .btn-danger:active,
                            .btn-danger.active,
                            .open > .dropdown-toggle.btn-danger {
                                color: #ffffff;
                                background-color: #c9302c;
                                border-color: #ac2925;
                            }
                    
                            .btn-danger:active:hover,
                            .btn-danger.active:hover,
                            .open > .dropdown-toggle.btn-danger:hover,
                            .btn-danger:active:focus,
                            .btn-danger.active:focus,
                            .open > .dropdown-toggle.btn-danger:focus,
                            .btn-danger:active.focus,
                            .btn-danger.active.focus,
                            .open > .dropdown-toggle.btn-danger.focus {
                                color: #ffffff;
                                background-color: #ac2925;
                                border-color: #761c19;
                            }
                    
                            .btn-danger:active,
                            .btn-danger.active,
                            .open > .dropdown-toggle.btn-danger {
                                background-image: none;
                            }
                    
                            .btn-danger.disabled:hover,
                            .btn-danger[disabled]:hover,
                            fieldset[disabled] .btn-danger:hover,
                            .btn-danger.disabled:focus,
                            .btn-danger[disabled]:focus,
                            fieldset[disabled] .btn-danger:focus,
                            .btn-danger.disabled.focus,
                            .btn-danger[disabled].focus,
                            fieldset[disabled] .btn-danger.focus {
                                background-color: #d9534f;
                                border-color: #d43f3a;
                            }
                    
                            .btn-danger .badge {
                                color: #d9534f;
                                background-color: #ffffff;
                            }
                    
                            .btn-link {
                                color: #006495;
                                font-weight: normal;
                                border-radius: 0;
                            }
                    
                            .btn-link,
                            .btn-link:active,
                            .btn-link.active,
                            .btn-link[disabled],
                            fieldset[disabled] .btn-link {
                                background-color: transparent;
                                -webkit-box-shadow: none;
                                box-shadow: none;
                            }
                    
                            .btn-link,
                            .btn-link:hover,
                            .btn-link:focus,
                            .btn-link:active {
                                border-color: transparent;
                            }
                    
                            .btn-link:hover,
                            .btn-link:focus {
                                color: #003048;
                                text-decoration: underline;
                                background-color: transparent;
                            }
                    
                            .btn-link[disabled]:hover,
                            fieldset[disabled] .btn-link:hover,
                            .btn-link[disabled]:focus,
                            fieldset[disabled] .btn-link:focus {
                                color: #777777;
                                text-decoration: none;
                            }
                    
                            .btn-lg {
                                padding: 10px 16px;
                                font-size: 18px;
                                line-height: 1.3333333;
                                border-radius: 6px;
                            }
                    
                            .btn-sm {
                                padding: 5px 10px;
                                font-size: 12px;
                                line-height: 1.5;
                                border-radius: 3px;
                            }
                    
                            .btn-xs {
                                padding: 1px 5px;
                                font-size: 12px;
                                line-height: 1.5;
                                border-radius: 3px;
                            }
                    
                            .btn-block {
                                display: block;
                                width: 100%;
                            }
                    
                            .btn-block + .btn-block {
                                margin-top: 5px;
                            }
                    
                            input[type="submit"].btn-block,
                            input[type="reset"].btn-block,
                            input[type="button"].btn-block {
                                width: 100%;
                            }
                    
                            .label {
                                display: inline;
                                padding: .2em .6em .3em;
                                font-size: 75%;
                                font-weight: bold;
                                line-height: 1;
                                color: #ffffff;
                                text-align: center;
                                white-space: nowrap;
                                vertical-align: baseline;
                                border-radius: .25em;
                            }
                    
                            a.label:hover,
                            a.label:focus {
                                color: #ffffff;
                                text-decoration: none;
                                cursor: pointer;
                            }
                    
                            .label:empty {
                                display: none;
                            }
                    
                            .btn .label {
                                position: relative;
                                top: -1px;
                            }
                    
                            .label-default {
                                background-color: #777777;
                            }
                    
                            .label-default[href]:hover,
                            .label-default[href]:focus {
                                background-color: #5e5e5e;
                            }
                    
                            .label-primary {
                                background-color: #006495;
                            }
                    
                            .label-primary[href]:hover,
                            .label-primary[href]:focus {
                                background-color: #004262;
                            }
                    
                            .label-success {
                                background-color: #5cb85c;
                            }
                    
                            .label-success[href]:hover,
                            .label-success[href]:focus {
                                background-color: #449d44;
                            }
                    
                            .label-info {
                                background-color: #5bc0de;
                            }
                    
                            .label-info[href]:hover,
                            .label-info[href]:focus {
                                background-color: #31b0d5;
                            }
                    
                            .label-warning {
                                background-color: #ffab40;
                            }
                    
                            .label-warning[href]:hover,
                            .label-warning[href]:focus {
                                background-color: #ff950d;
                            }
                    
                            .label-danger {
                                background-color: #d9534f;
                            }
                    
                            .label-danger[href]:hover,
                            .label-danger[href]:focus {
                                background-color: #c9302c;
                            }
                    
                            .badge {
                                display: inline-block;
                                min-width: 10px;
                                padding: 3px 7px;
                                font-size: 12px;
                                font-weight: bold;
                                color: #ffffff;
                                line-height: 1;
                                vertical-align: middle;
                                white-space: nowrap;
                                text-align: center;
                                background-color: #777777;
                                border-radius: 10px;
                            }
                    
                            .badge:empty {
                                display: none;
                            }
                    
                            .btn .badge {
                                position: relative;
                                top: -1px;
                            }
                    
                            .btn-xs .badge,
                            .btn-group-xs > .btn .badge {
                                top: 0;
                                padding: 1px 5px;
                            }
                    
                            a.badge:hover,
                            a.badge:focus {
                                color: #ffffff;
                                text-decoration: none;
                                cursor: pointer;
                            }
                    
                            .list-group-item.active > .badge,
                            .nav-pills > .active > a > .badge {
                                color: #006495;
                                background-color: #ffffff;
                            }
                    
                            .list-group-item > .badge {
                                float: right;
                            }
                    
                            .list-group-item > .badge + .badge {
                                margin-right: 5px;
                            }
                    
                            .nav-pills > li > a > .badge {
                                margin-left: 3px;
                            }
                    
                            .media {
                                margin-top: 15px;
                            }
                    
                            .media:first-child {
                                margin-top: 0;
                            }
                    
                            .media,
                            .media-body {
                                zoom: 1;
                                overflow: hidden;
                            }
                    
                            .media-body {
                                width: 10000px;
                            }
                    
                            .media-object {
                                display: block;
                            }
                    
                            .media-object.img-thumbnail {
                                max-width: none;
                            }
                    
                            .media-right,
                            .media > .pull-right {
                                padding-left: 10px;
                            }
                    
                            .media-left,
                            .media > .pull-left {
                                padding-right: 10px;
                            }
                    
                            .media-left,
                            .media-right,
                            .media-body {
                                display: table-cell;
                                vertical-align: top;
                            }
                    
                            .media-middle {
                                vertical-align: middle;
                            }
                    
                            .media-bottom {
                                vertical-align: bottom;
                            }
                    
                            .media-heading {
                                margin-top: 0;
                                margin-bottom: 5px;
                            }
                    
                            .media-list {
                                padding-left: 0;
                                list-style: none;
                            }
                    
                            .list-group {
                                margin-bottom: 20px;
                                padding-left: 0;
                            }
                    
                            .list-group-item {
                                position: relative;
                                display: block;
                                padding: 10px 15px;
                                margin-bottom: -1px;
                                background-color: #ffffff;
                                border: 1px solid #dddddd;
                            }
                    
                            .list-group-item:first-child {
                                border-top-right-radius: 4px;
                                border-top-left-radius: 4px;
                            }
                    
                            .list-group-item:last-child {
                                margin-bottom: 0;
                                border-bottom-right-radius: 4px;
                                border-bottom-left-radius: 4px;
                            }
                    
                            a.list-group-item,
                            button.list-group-item {
                                color: #555555;
                            }
                    
                            a.list-group-item .list-group-item-heading,
                            button.list-group-item .list-group-item-heading {
                                color: #333333;
                            }
                    
                            a.list-group-item:hover,
                            button.list-group-item:hover,
                            a.list-group-item:focus,
                            button.list-group-item:focus {
                                text-decoration: none;
                                color: #555555;
                                background-color: #f5f5f5;
                            }
                    
                            button.list-group-item {
                                width: 100%;
                                text-align: left;
                            }
                    
                            .list-group-item.disabled,
                            .list-group-item.disabled:hover,
                            .list-group-item.disabled:focus {
                                background-color: #eeeeee;
                                color: #777777;
                                cursor: not-allowed;
                            }
                    
                            .list-group-item.disabled .list-group-item-heading,
                            .list-group-item.disabled:hover .list-group-item-heading,
                            .list-group-item.disabled:focus .list-group-item-heading {
                                color: inherit;
                            }
                    
                            .list-group-item.disabled .list-group-item-text,
                            .list-group-item.disabled:hover .list-group-item-text,
                            .list-group-item.disabled:focus .list-group-item-text {
                                color: #777777;
                            }
                    
                            .list-group-item.active,
                            .list-group-item.active:hover,
                            .list-group-item.active:focus {
                                z-index: 2;
                                color: #ffffff;
                                background-color: #006495;
                                border-color: #006495;
                            }
                    
                            .list-group-item.active .list-group-item-heading,
                            .list-group-item.active:hover .list-group-item-heading,
                            .list-group-item.active:focus .list-group-item-heading,
                            .list-group-item.active .list-group-item-heading > small,
                            .list-group-item.active:hover .list-group-item-heading > small,
                            .list-group-item.active:focus .list-group-item-heading > small,
                            .list-group-item.active .list-group-item-heading > .small,
                            .list-group-item.active:hover .list-group-item-heading > .small,
                            .list-group-item.active:focus .list-group-item-heading > .small {
                                color: inherit;
                            }
                    
                            .list-group-item.active .list-group-item-text,
                            .list-group-item.active:hover .list-group-item-text,
                            .list-group-item.active:focus .list-group-item-text {
                                color: #62cbff;
                            }
                    
                            .list-group-item-success {
                                color: #3c763d;
                                background-color: #dff0d8;
                            }
                    
                            a.list-group-item-success,
                            button.list-group-item-success {
                                color: #3c763d;
                            }
                    
                            a.list-group-item-success .list-group-item-heading,
                            button.list-group-item-success .list-group-item-heading {
                                color: inherit;
                            }
                    
                            a.list-group-item-success:hover,
                            button.list-group-item-success:hover,
                            a.list-group-item-success:focus,
                            button.list-group-item-success:focus {
                                color: #3c763d;
                                background-color: #d0e9c6;
                            }
                    
                            a.list-group-item-success.active,
                            button.list-group-item-success.active,
                            a.list-group-item-success.active:hover,
                            button.list-group-item-success.active:hover,
                            a.list-group-item-success.active:focus,
                            button.list-group-item-success.active:focus {
                                color: #fff;
                                background-color: #3c763d;
                                border-color: #3c763d;
                            }
                    
                            .list-group-item-info {
                                color: #31708f;
                                background-color: #d9edf7;
                            }
                    
                            a.list-group-item-info,
                            button.list-group-item-info {
                                color: #31708f;
                            }
                    
                            a.list-group-item-info .list-group-item-heading,
                            button.list-group-item-info .list-group-item-heading {
                                color: inherit;
                            }
                    
                            a.list-group-item-info:hover,
                            button.list-group-item-info:hover,
                            a.list-group-item-info:focus,
                            button.list-group-item-info:focus {
                                color: #31708f;
                                background-color: #c4e3f3;
                            }
                    
                            a.list-group-item-info.active,
                            button.list-group-item-info.active,
                            a.list-group-item-info.active:hover,
                            button.list-group-item-info.active:hover,
                            a.list-group-item-info.active:focus,
                            button.list-group-item-info.active:focus {
                                color: #fff;
                                background-color: #31708f;
                                border-color: #31708f;
                            }
                    
                            .list-group-item-warning {
                                color: #8a6d3b;
                                background-color: #fcf8e3;
                            }
                    
                            a.list-group-item-warning,
                            button.list-group-item-warning {
                                color: #8a6d3b;
                            }
                    
                            a.list-group-item-warning .list-group-item-heading,
                            button.list-group-item-warning .list-group-item-heading {
                                color: inherit;
                            }
                    
                            a.list-group-item-warning:hover,
                            button.list-group-item-warning:hover,
                            a.list-group-item-warning:focus,
                            button.list-group-item-warning:focus {
                                color: #8a6d3b;
                                background-color: #faf2cc;
                            }
                    
                            a.list-group-item-warning.active,
                            button.list-group-item-warning.active,
                            a.list-group-item-warning.active:hover,
                            button.list-group-item-warning.active:hover,
                            a.list-group-item-warning.active:focus,
                            button.list-group-item-warning.active:focus {
                                color: #fff;
                                background-color: #8a6d3b;
                                border-color: #8a6d3b;
                            }
                    
                            .list-group-item-danger {
                                color: #a94442;
                                background-color: #f2dede;
                            }
                    
                            a.list-group-item-danger,
                            button.list-group-item-danger {
                                color: #a94442;
                            }
                    
                            a.list-group-item-danger .list-group-item-heading,
                            button.list-group-item-danger .list-group-item-heading {
                                color: inherit;
                            }
                    
                            a.list-group-item-danger:hover,
                            button.list-group-item-danger:hover,
                            a.list-group-item-danger:focus,
                            button.list-group-item-danger:focus {
                                color: #a94442;
                                background-color: #ebcccc;
                            }
                    
                            a.list-group-item-danger.active,
                            button.list-group-item-danger.active,
                            a.list-group-item-danger.active:hover,
                            button.list-group-item-danger.active:hover,
                            a.list-group-item-danger.active:focus,
                            button.list-group-item-danger.active:focus {
                                color: #fff;
                                background-color: #a94442;
                                border-color: #a94442;
                            }
                    
                            .list-group-item-heading {
                                margin-top: 0;
                                margin-bottom: 5px;
                            }
                    
                            .list-group-item-text {
                                margin-bottom: 0;
                                line-height: 1.3;
                            }
                    
                            .panel {
                                margin-bottom: 20px;
                                background-color: #ffffff;
                                border: 1px solid transparent;
                                border-radius: 4px;
                                -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
                                box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
                            }
                    
                            .panel-body {
                                padding: 15px;
                            }
                    
                            .panel-heading {
                                padding: 10px 15px;
                                border-bottom: 1px solid transparent;
                                border-top-right-radius: 3px;
                                border-top-left-radius: 3px;
                            }
                    
                            .panel-heading > .dropdown .dropdown-toggle {
                                color: inherit;
                            }
                    
                            .panel-title {
                                margin-top: 0;
                                margin-bottom: 0;
                                font-size: 16px;
                                color: inherit;
                            }
                    
                            .panel-title > a,
                            .panel-title > small,
                            .panel-title > .small,
                            .panel-title > small > a,
                            .panel-title > .small > a {
                                color: inherit;
                            }
                    
                            .panel-footer {
                                padding: 10px 15px;
                                background-color: #f5f5f5;
                                border-top: 1px solid #dddddd;
                                border-bottom-right-radius: 3px;
                                border-bottom-left-radius: 3px;
                            }
                    
                            .panel > .list-group,
                            .panel > .panel-collapse > .list-group {
                                margin-bottom: 0;
                            }
                    
                            .panel > .list-group .list-group-item,
                            .panel > .panel-collapse > .list-group .list-group-item {
                                border-width: 1px 0;
                                border-radius: 0;
                            }
                    
                            .panel > .list-group:first-child .list-group-item:first-child,
                            .panel > .panel-collapse > .list-group:first-child .list-group-item:first-child {
                                border-top: 0;
                                border-top-right-radius: 3px;
                                border-top-left-radius: 3px;
                            }
                    
                            .panel > .list-group:last-child .list-group-item:last-child,
                            .panel > .panel-collapse > .list-group:last-child .list-group-item:last-child {
                                border-bottom: 0;
                                border-bottom-right-radius: 3px;
                                border-bottom-left-radius: 3px;
                            }
                    
                            .panel > .panel-heading + .panel-collapse > .list-group .list-group-item:first-child {
                                border-top-right-radius: 0;
                                border-top-left-radius: 0;
                            }
                    
                            .panel-heading + .list-group .list-group-item:first-child {
                                border-top-width: 0;
                            }
                    
                            .list-group + .panel-footer {
                                border-top-width: 0;
                            }
                    
                            .panel > .table,
                            .panel > .table-responsive > .table,
                            .panel > .panel-collapse > .table {
                                margin-bottom: 0;
                            }
                    
                            .panel > .table caption,
                            .panel > .table-responsive > .table caption,
                            .panel > .panel-collapse > .table caption {
                                padding-left: 15px;
                                padding-right: 15px;
                            }
                    
                            .panel > .table:first-child,
                            .panel > .table-responsive:first-child > .table:first-child {
                                border-top-right-radius: 3px;
                                border-top-left-radius: 3px;
                            }
                    
                            .panel > .table:first-child > thead:first-child > tr:first-child,
                            .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child,
                            .panel > .table:first-child > tbody:first-child > tr:first-child,
                            .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child {
                                border-top-left-radius: 3px;
                                border-top-right-radius: 3px;
                            }
                    
                            .panel > .table:first-child > thead:first-child > tr:first-child td:first-child,
                            .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:first-child,
                            .panel > .table:first-child > tbody:first-child > tr:first-child td:first-child,
                            .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:first-child,
                            .panel > .table:first-child > thead:first-child > tr:first-child th:first-child,
                            .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:first-child,
                            .panel > .table:first-child > tbody:first-child > tr:first-child th:first-child,
                            .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:first-child {
                                border-top-left-radius: 3px;
                            }
                    
                            .panel > .table:first-child > thead:first-child > tr:first-child td:last-child,
                            .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:last-child,
                            .panel > .table:first-child > tbody:first-child > tr:first-child td:last-child,
                            .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:last-child,
                            .panel > .table:first-child > thead:first-child > tr:first-child th:last-child,
                            .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:last-child,
                            .panel > .table:first-child > tbody:first-child > tr:first-child th:last-child,
                            .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:last-child {
                                border-top-right-radius: 3px;
                            }
                    
                            .panel > .table:last-child,
                            .panel > .table-responsive:last-child > .table:last-child {
                                border-bottom-right-radius: 3px;
                                border-bottom-left-radius: 3px;
                            }
                    
                            .panel > .table:last-child > tbody:last-child > tr:last-child,
                            .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child,
                            .panel > .table:last-child > tfoot:last-child > tr:last-child,
                            .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child {
                                border-bottom-left-radius: 3px;
                                border-bottom-right-radius: 3px;
                            }
                    
                            .panel > .table:last-child > tbody:last-child > tr:last-child td:first-child,
                            .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:first-child,
                            .panel > .table:last-child > tfoot:last-child > tr:last-child td:first-child,
                            .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:first-child,
                            .panel > .table:last-child > tbody:last-child > tr:last-child th:first-child,
                            .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:first-child,
                            .panel > .table:last-child > tfoot:last-child > tr:last-child th:first-child,
                            .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:first-child {
                                border-bottom-left-radius: 3px;
                            }
                    
                            .panel > .table:last-child > tbody:last-child > tr:last-child td:last-child,
                            .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:last-child,
                            .panel > .table:last-child > tfoot:last-child > tr:last-child td:last-child,
                            .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:last-child,
                            .panel > .table:last-child > tbody:last-child > tr:last-child th:last-child,
                            .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:last-child,
                            .panel > .table:last-child > tfoot:last-child > tr:last-child th:last-child,
                            .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:last-child {
                                border-bottom-right-radius: 3px;
                            }
                    
                            .panel > .panel-body + .table,
                            .panel > .panel-body + .table-responsive,
                            .panel > .table + .panel-body,
                            .panel > .table-responsive + .panel-body {
                                border-top: 1px solid #dddddd;
                            }
                    
                            .panel > .table > tbody:first-child > tr:first-child th,
                            .panel > .table > tbody:first-child > tr:first-child td {
                                border-top: 0;
                            }
                    
                            .panel > .table-bordered,
                            .panel > .table-responsive > .table-bordered {
                                border: 0;
                            }
                    
                            .panel > .table-bordered > thead > tr > th:first-child,
                            .panel > .table-responsive > .table-bordered > thead > tr > th:first-child,
                            .panel > .table-bordered > tbody > tr > th:first-child,
                            .panel > .table-responsive > .table-bordered > tbody > tr > th:first-child,
                            .panel > .table-bordered > tfoot > tr > th:first-child,
                            .panel > .table-responsive > .table-bordered > tfoot > tr > th:first-child,
                            .panel > .table-bordered > thead > tr > td:first-child,
                            .panel > .table-responsive > .table-bordered > thead > tr > td:first-child,
                            .panel > .table-bordered > tbody > tr > td:first-child,
                            .panel > .table-responsive > .table-bordered > tbody > tr > td:first-child,
                            .panel > .table-bordered > tfoot > tr > td:first-child,
                            .panel > .table-responsive > .table-bordered > tfoot > tr > td:first-child {
                                border-left: 0;
                            }
                    
                            .panel > .table-bordered > thead > tr > th:last-child,
                            .panel > .table-responsive > .table-bordered > thead > tr > th:last-child,
                            .panel > .table-bordered > tbody > tr > th:last-child,
                            .panel > .table-responsive > .table-bordered > tbody > tr > th:last-child,
                            .panel > .table-bordered > tfoot > tr > th:last-child,
                            .panel > .table-responsive > .table-bordered > tfoot > tr > th:last-child,
                            .panel > .table-bordered > thead > tr > td:last-child,
                            .panel > .table-responsive > .table-bordered > thead > tr > td:last-child,
                            .panel > .table-bordered > tbody > tr > td:last-child,
                            .panel > .table-responsive > .table-bordered > tbody > tr > td:last-child,
                            .panel > .table-bordered > tfoot > tr > td:last-child,
                            .panel > .table-responsive > .table-bordered > tfoot > tr > td:last-child {
                                border-right: 0;
                            }
                    
                            .panel > .table-bordered > thead > tr:first-child > td,
                            .panel > .table-responsive > .table-bordered > thead > tr:first-child > td,
                            .panel > .table-bordered > tbody > tr:first-child > td,
                            .panel > .table-responsive > .table-bordered > tbody > tr:first-child > td,
                            .panel > .table-bordered > thead > tr:first-child > th,
                            .panel > .table-responsive > .table-bordered > thead > tr:first-child > th,
                            .panel > .table-bordered > tbody > tr:first-child > th,
                            .panel > .table-responsive > .table-bordered > tbody > tr:first-child > th {
                                border-bottom: 0;
                            }
                    
                            .panel > .table-bordered > tbody > tr:last-child > td,
                            .panel > .table-responsive > .table-bordered > tbody > tr:last-child > td,
                            .panel > .table-bordered > tfoot > tr:last-child > td,
                            .panel > .table-responsive > .table-bordered > tfoot > tr:last-child > td,
                            .panel > .table-bordered > tbody > tr:last-child > th,
                            .panel > .table-responsive > .table-bordered > tbody > tr:last-child > th,
                            .panel > .table-bordered > tfoot > tr:last-child > th,
                            .panel > .table-responsive > .table-bordered > tfoot > tr:last-child > th {
                                border-bottom: 0;
                            }
                    
                            .panel > .table-responsive {
                                border: 0;
                                margin-bottom: 0;
                            }
                    
                            .panel-group {
                                margin-bottom: 20px;
                            }
                    
                            .panel-group .panel {
                                margin-bottom: 0;
                                border-radius: 4px;
                            }
                    
                            .panel-group .panel + .panel {
                                margin-top: 5px;
                            }
                    
                            .panel-group .panel-heading {
                                border-bottom: 0;
                            }
                    
                            .panel-group .panel-heading + .panel-collapse > .panel-body,
                            .panel-group .panel-heading + .panel-collapse > .list-group {
                                border-top: 1px solid #dddddd;
                            }
                    
                            .panel-group .panel-footer {
                                border-top: 0;
                            }
                    
                            .panel-group .panel-footer + .panel-collapse .panel-body {
                                border-bottom: 1px solid #dddddd;
                            }
                    
                            .panel-default {
                                border-color: #dddddd;
                            }
                    
                            .panel-default > .panel-heading {
                                color: #333333;
                                background-color: #f5f5f5;
                                border-color: #dddddd;
                            }
                    
                            .panel-default > .panel-heading + .panel-collapse > .panel-body {
                                border-top-color: #dddddd;
                            }
                    
                            .panel-default > .panel-heading .badge {
                                color: #f5f5f5;
                                background-color: #333333;
                            }
                    
                            .panel-default > .panel-footer + .panel-collapse > .panel-body {
                                border-bottom-color: #dddddd;
                            }
                    
                            .panel-primary {
                                border-color: #006495;
                            }
                    
                            .panel-primary > .panel-heading {
                                color: #ffffff;
                                background-color: #006495;
                                border-color: #006495;
                            }
                    
                            .panel-primary > .panel-heading + .panel-collapse > .panel-body {
                                border-top-color: #006495;
                            }
                    
                            .panel-primary > .panel-heading .badge {
                                color: #006495;
                                background-color: #ffffff;
                            }
                    
                            .panel-primary > .panel-footer + .panel-collapse > .panel-body {
                                border-bottom-color: #006495;
                            }
                    
                            .panel-success {
                                border-color: #d6e9c6;
                            }
                    
                            .panel-success > .panel-heading {
                                color: #3c763d;
                                background-color: #dff0d8;
                                border-color: #d6e9c6;
                            }
                    
                            .panel-success > .panel-heading + .panel-collapse > .panel-body {
                                border-top-color: #d6e9c6;
                            }
                    
                            .panel-success > .panel-heading .badge {
                                color: #dff0d8;
                                background-color: #3c763d;
                            }
                    
                            .panel-success > .panel-footer + .panel-collapse > .panel-body {
                                border-bottom-color: #d6e9c6;
                            }
                    
                            .panel-info {
                                border-color: #bce8f1;
                            }
                    
                            .panel-info > .panel-heading {
                                color: #31708f;
                                background-color: #d9edf7;
                                border-color: #bce8f1;
                            }
                    
                            .panel-info > .panel-heading + .panel-collapse > .panel-body {
                                border-top-color: #bce8f1;
                            }
                    
                            .panel-info > .panel-heading .badge {
                                color: #d9edf7;
                                background-color: #31708f;
                            }
                    
                            .panel-info > .panel-footer + .panel-collapse > .panel-body {
                                border-bottom-color: #bce8f1;
                            }
                    
                            .panel-warning {
                                border-color: #faebcc;
                            }
                    
                            .panel-warning > .panel-heading {
                                color: #8a6d3b;
                                background-color: #fcf8e3;
                                border-color: #faebcc;
                            }
                    
                            .panel-warning > .panel-heading + .panel-collapse > .panel-body {
                                border-top-color: #faebcc;
                            }
                    
                            .panel-warning > .panel-heading .badge {
                                color: #fcf8e3;
                                background-color: #8a6d3b;
                            }
                    
                            .panel-warning > .panel-footer + .panel-collapse > .panel-body {
                                border-bottom-color: #faebcc;
                            }
                    
                            .panel-danger {
                                border-color: #ebccd1;
                            }
                    
                            .panel-danger > .panel-heading {
                                color: #a94442;
                                background-color: #f2dede;
                                border-color: #ebccd1;
                            }
                    
                            .panel-danger > .panel-heading + .panel-collapse > .panel-body {
                                border-top-color: #ebccd1;
                            }
                    
                            .panel-danger > .panel-heading .badge {
                                color: #f2dede;
                                background-color: #a94442;
                            }
                    
                            .panel-danger > .panel-footer + .panel-collapse > .panel-body {
                                border-bottom-color: #ebccd1;
                            }
                    
                            .clearfix:before,
                            .clearfix:after,
                            .container:before,
                            .container:after,
                            .container-fluid:before,
                            .container-fluid:after,
                            .row:before,
                            .row:after,
                            .panel-body:before,
                            .panel-body:after {
                                content: " ";
                                display: table;
                            }
                    
                            .clearfix:after,
                            .container:after,
                            .container-fluid:after,
                            .row:after,
                            .panel-body:after {
                                clear: both;
                            }
                    
                            .center-block {
                                display: block;
                                margin-left: auto;
                                margin-right: auto;
                            }
                    
                            .pull-right {
                                float: right !important;
                            }
                    
                            .pull-left {
                                float: left !important;
                            }
                    
                            .hide {
                                display: none !important;
                            }
                    
                            .show {
                                display: block !important;
                            }
                    
                            .invisible {
                                visibility: hidden;
                            }
                    
                            .text-hide {
                                font: 0/0 a;
                                color: transparent;
                                text-shadow: none;
                                background-color: transparent;
                                border: 0;
                            }
                    
                            .hidden {
                                display: none !important;
                            }
                    
                            .affix {
                                position: fixed;
                            }
                    
                            @-ms-viewport {
                                width: device-width;
                            }
                    
                            .visible-xs,
                            .visible-sm,
                            .visible-md,
                            .visible-lg {
                                display: none !important;
                            }
                    
                            .visible-xs-block,
                            .visible-xs-inline,
                            .visible-xs-inline-block,
                            .visible-sm-block,
                            .visible-sm-inline,
                            .visible-sm-inline-block,
                            .visible-md-block,
                            .visible-md-inline,
                            .visible-md-inline-block,
                            .visible-lg-block,
                            .visible-lg-inline,
                            .visible-lg-inline-block {
                                display: none !important;
                            }
                    
                            @media (max-width: 767px) {
                                .visible-xs {
                                    display: block !important;
                                }
                    
                                table.visible-xs {
                                    display: table !important;
                                }
                    
                                tr.visible-xs {
                                    display: table-row !important;
                                }
                    
                                th.visible-xs,
                                td.visible-xs {
                                    display: table-cell !important;
                                }
                            }
                    
                            @media (max-width: 767px) {
                                .visible-xs-block {
                                    display: block !important;
                                }
                            }
                    
                            @media (max-width: 767px) {
                                .visible-xs-inline {
                                    display: inline !important;
                                }
                            }
                    
                            @media (max-width: 767px) {
                                .visible-xs-inline-block {
                                    display: inline-block !important;
                                }
                            }
                    
                            @media (min-width: 768px) and (max-width: 991px) {
                                .visible-sm {
                                    display: block !important;
                                }
                    
                                table.visible-sm {
                                    display: table !important;
                                }
                    
                                tr.visible-sm {
                                    display: table-row !important;
                                }
                    
                                th.visible-sm,
                                td.visible-sm {
                                    display: table-cell !important;
                                }
                            }
                    
                            @media (min-width: 768px) and (max-width: 991px) {
                                .visible-sm-block {
                                    display: block !important;
                                }
                            }
                    
                            @media (min-width: 768px) and (max-width: 991px) {
                                .visible-sm-inline {
                                    display: inline !important;
                                }
                            }
                    
                            @media (min-width: 768px) and (max-width: 991px) {
                                .visible-sm-inline-block {
                                    display: inline-block !important;
                                }
                            }
                    
                            @media (min-width: 992px) and (max-width: 1199px) {
                                .visible-md {
                                    display: block !important;
                                }
                    
                                table.visible-md {
                                    display: table !important;
                                }
                    
                                tr.visible-md {
                                    display: table-row !important;
                                }
                    
                                th.visible-md,
                                td.visible-md {
                                    display: table-cell !important;
                                }
                            }
                    
                            @media (min-width: 992px) and (max-width: 1199px) {
                                .visible-md-block {
                                    display: block !important;
                                }
                            }
                    
                            @media (min-width: 992px) and (max-width: 1199px) {
                                .visible-md-inline {
                                    display: inline !important;
                                }
                            }
                    
                            @media (min-width: 992px) and (max-width: 1199px) {
                                .visible-md-inline-block {
                                    display: inline-block !important;
                                }
                            }
                    
                            @media (min-width: 1200px) {
                                .visible-lg {
                                    display: block !important;
                                }
                    
                                table.visible-lg {
                                    display: table !important;
                                }
                    
                                tr.visible-lg {
                                    display: table-row !important;
                                }
                    
                                th.visible-lg,
                                td.visible-lg {
                                    display: table-cell !important;
                                }
                            }
                    
                            @media (min-width: 1200px) {
                                .visible-lg-block {
                                    display: block !important;
                                }
                            }
                    
                            @media (min-width: 1200px) {
                                .visible-lg-inline {
                                    display: inline !important;
                                }
                            }
                    
                            @media (min-width: 1200px) {
                                .visible-lg-inline-block {
                                    display: inline-block !important;
                                }
                            }
                    
                            @media (max-width: 767px) {
                                .hidden-xs {
                                    display: none !important;
                                }
                            }
                    
                            @media (min-width: 768px) and (max-width: 991px) {
                                .hidden-sm {
                                    display: none !important;
                                }
                            }
                    
                            @media (min-width: 992px) and (max-width: 1199px) {
                                .hidden-md {
                                    display: none !important;
                                }
                            }
                    
                            @media (min-width: 1200px) {
                                .hidden-lg {
                                    display: none !important;
                                }
                            }
                    
                            .visible-print {
                                display: none !important;
                            }
                    
                            @media print {
                                .visible-print {
                                    display: block !important;
                                }
                    
                                table.visible-print {
                                    display: table !important;
                                }
                    
                                tr.visible-print {
                                    display: table-row !important;
                                }
                    
                                th.visible-print,
                                td.visible-print {
                                    display: table-cell !important;
                                }
                            }
                    
                            .visible-print-block {
                                display: none !important;
                            }
                    
                            @media print {
                                .visible-print-block {
                                    display: block !important;
                                }
                            }
                    
                            .visible-print-inline {
                                display: none !important;
                            }
                    
                            @media print {
                                .visible-print-inline {
                                    display: inline !important;
                                }
                            }
                    
                            .visible-print-inline-block {
                                display: none !important;
                            }
                    
                            @media print {
                                .visible-print-inline-block {
                                    display: inline-block !important;
                                }
                            }
                    
                            @media print {
                                .hidden-print {
                                    display: none !important;
                                }
                            }
                    
                            th,
                            td {
                                padding: 8px 8px 8px 8px;
                            }
                    
                            th {
                                border-bottom: 2px solid #333333;
                            }
                    
                            td {
                                border-bottom: 1px dotted #999999;
                            }
                    
                            tfoot td {
                                border-bottom-width: 0px;
                                border-top: 2px solid #333333;
                                padding-top: 20px;
                            }
                        </style>
                    </head>
                    <body>
                    <div class="container">
                        <div class="row">
                            <div class="col-xs-12">
                                <img src="${extrato.imobiliaria?.logo}"
                                     style="display: block;margin: auto;max-height: 70px;">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <hr>
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="col-xs-12">
                                <h3 style="text-align:center;">${extrato.imobiliaria?.razaoSocial}<br> Extrato do
                                    período: ${extrato.periodo}</h3>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <hr>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-3">Contrato: ${extrato.contrato?.codigo}</div>
                            <div class="col-xs-3">Parcela: ${extrato.parcela}</div>
                            <div class="col-xs-3">Depósito: ${extrato.dataDeposito && formatoData(extrato.dataDeposito)}</div>
                        </div>
                        <div class="row">
                            <div class="col-xs-5">Locatário: ${extrato.proprietario?.nome}</div>
                            <div class="col-xs-4">Documento: ${extrato.proprietario?.documento}</div>
                        </div>
                        <div class="row">
                            <div class="col-xs-6"></div>
                            <div class="col-xs-6">Responsável: ${extrato.responsavel}</div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">Imóvel: ${extrato.contrato?.imovel.endereco}, ${extrato.contrato?.imovel.bairro}, ${extrato.contrato?.imovel.cidade}/${extrato.contrato?.imovel.estado}</div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <hr>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <table class="table table-striped" style="width:100%">
                                    <tr>
                                        <td colspan="2" class="text-uppercase text-bold">
                                            Lançamentos
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="border-top:1px solid black;">Descrição</td>
                                        <td style="border-top:1px solid black;text-align: right;">Valor</td>
                                    </tr>
                                    
                                    ${extrato.itens.map((item) => {
                                        return `<tr>
                                        <td>${item.descricao}</td>
                                        <td style="text-align: right;">${formatoValor(item.valor)}</td>
                                    </tr>`
                                    })}
                       
                                    <tr style="background-color: #e6e6e6;">
                                        <td class="text-bold" style="border-top:1px solid black;border-bottom:1px solid black;">
                                            Vencimento: ${extrato.vencimento && formatoData(extrato.vencimento)}</td>
                                        <td colspan="1" style="border-top:1px solid black;border-bottom:1px solid black;text-align: right;">
                                            Total: ${formatoValor(extrato.itens.reduce((acc,item) => item.valor+acc,0))}</td>
                                    </tr>
                                    ${extrato.observacao1 && `<tr>
                                    <td colspan="2">
                                        Informações
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">${extrato.observacao1}</td>
                                </tr>` }

                                ${extrato.observacao2 && `
                                <tr>
                                    <td colspan="2">${extrato.observacao2}</td>
                                </tr>` }
                                ${extrato.observacao3 && `
                                <tr>
                                    <td colspan="2">${extrato.observacao3}</td>
                                </tr>` }
                                ${extrato.observacao4 && `
                                <tr>
                                    <td colspan="2">${extrato.observacao4}</td>
                                </tr>` }
                                ${extrato.observacao5 && `
                                <tr>
                                    <td colspan="2">${extrato.observacao5}</td>
                                </tr>` }
                                        
                                   
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    </body>
                    </html>`,
                }}
            ></div>
        </>
    );
};
const Page = ({ extrato }) => {
    return <Extrato extrato={extrato} />;
};

export default Page;
export const getServerSideProps = async ({ req, res, query }) => {
    const { id } = query;
    const response = await prisma.extrato.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            imobiliaria: true,
            itens:true,
            contrato:{
                include:{
                    imovel:true
                }
            },
            proprietario:true
        },
    });
    let extrato = JSON.parse(JSON.stringify(response));
    const exportPDF = query.pdf === "true";
    const isServer = !!req;

    if (isServer && exportPDF) {
        const buffer = await pdf.componentToPDFBuffer(
            <Extrato extrato={extrato} />
        );

        // with this header, your browser will prompt you to download the file
        // without this header, your browse will open the pdf directly
        res.setHeader(
            "Content-disposition",
            `attachment; filename=${extrato.id}.pdf`
        );

        // set content type
        res.setHeader("Content-Type", "application/pdf");

        // output the pdf buffer. once res.end is triggered, it won't trigger the render method
        res.end(buffer);
    }

    return {
        props: {
            extrato,
        },
    };
};