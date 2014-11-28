// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.devtools.panels.create(
    'Code Window',
    null, // No icon path
    'Panel/PreprocessorPanel.html',
    null // no callback needed
);

chrome.devtools.panels.create(
    'Test Window',
    null, // No icon path
    'Panel/codewindow.html',
    null // no callback needed
);
