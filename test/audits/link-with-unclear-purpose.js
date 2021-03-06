// Copyright 2014 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

module('LinkWithUnclearPurpose');

test('a link with meaningful text is good', function() {
    var fixture = document.getElementById('qunit-fixture');
    var a = document.createElement('a');
    a.href = '#main';
    a.textContent = 'Learn more about trout fishing';

    fixture.appendChild(a);
    var rule = axs.AuditRules.getRule('linkWithUnclearPurpose');
    deepEqual(
        rule.run({scope: fixture}),
        { elements: [], result: axs.constants.AuditResult.PASS });
});

test('a link with an img with meaningful alt text is good', function() {
    var fixture = document.getElementById('qunit-fixture');
    var a = document.createElement('a');
    a.href = '#main';
    var img = a.appendChild(document.createElement('img'));
    img.setAttribute('alt', 'Learn more about trout fishing');

    fixture.appendChild(a);
    var rule = axs.AuditRules.getRule('linkWithUnclearPurpose');
    deepEqual(
        rule.run({scope: fixture}),
        { elements: [], result: axs.constants.AuditResult.PASS });
});

test('a link with an img with meaningless alt text is bad', function() {
    var fixture = document.getElementById('qunit-fixture');
    var a = document.createElement('a');
    a.href = '#main';
    var img = a.appendChild(document.createElement('img'));
    img.setAttribute('alt', 'Click here!');

    fixture.appendChild(a);
    var rule = axs.AuditRules.getRule('linkWithUnclearPurpose');
    deepEqual(rule.run({scope: fixture}),
        { elements: [a], result: axs.constants.AuditResult.FAIL });
});

/*
 * This test will need to be reviewed when issue #214 is addressed.
 */
test('a link with meaningful aria-label is good', function() {
    var fixture = document.getElementById('qunit-fixture');
    // Style our link to be visually meaningful with no descendent nodes at all.
    fixture.innerHTML = '<style>a.trout::after{content: "Learn more about trout fishing"}</style>';
    var a = document.createElement('a');
    a.href = '#main';
    a.className = 'trout';
    a.setAttribute('aria-label', 'Learn more about trout fishing');
    fixture.appendChild(a);
    var rule = axs.AuditRules.getRule('linkWithUnclearPurpose');
    deepEqual(
        rule.run({scope: fixture}),
        { elements: [], result: axs.constants.AuditResult.PASS });
});

/*
 * This test will need to be reviewed when issue #214 is addressed.
 */
test('a link with meaningful aria-labelledby is good', function() {
    var fixture = document.getElementById('qunit-fixture');
    // Style our link to be visually meaningful with no descendent nodes at all.
    fixture.innerHTML = '<style>a.trout::after{content: "Learn more about trout fishing"}</style>';
    var a = document.createElement('a');
    a.href = '#main';
    a.className = 'trout';
    var label = document.createElement('span');
    label.textContent = 'Learn more about trout fishing';
    label.id = "trout" + Date.now();
    a.setAttribute('aria-labelledby', label.id);
    fixture.appendChild(a);
    fixture.appendChild(label);
    var rule = axs.AuditRules.getRule('linkWithUnclearPurpose');
    deepEqual(
        rule.run({scope: fixture}),
        { elements: [], result: axs.constants.AuditResult.PASS });
});

test('a link without meaningful text is bad', function() {
    var fixture = document.getElementById('qunit-fixture');
    var a = document.createElement('a');
    a.href = '#main';
    fixture.appendChild(a);
    var rule = axs.AuditRules.getRule('linkWithUnclearPurpose');

    var badLinks = ['click here.', 'Click here!', 'Learn more.', 'this page', 'this link', 'here'];
    badLinks.forEach(function(text) {
        a.textContent = text;
        deepEqual(rule.run({scope: fixture}),
                  { elements: [a], result: axs.constants.AuditResult.FAIL });
    });
});

test('a link with bg image and meaningful aria-label is good', function() {
    var fixture = document.getElementById('qunit-fixture');
    // Style our link to be visually meaningful with no descendent nodes at all.
    fixture.innerHTML = '<style>a.trout{background-image: url("/trout.png"); display:block; height:1em}</style>';
    var a = document.createElement('a');
    a.href = '#main';
    a.className = 'trout';
    a.setAttribute('aria-label', 'Learn more about trout fishing');
    fixture.appendChild(a);
    var rule = axs.AuditRules.getRule('linkWithUnclearPurpose');
    deepEqual(
        rule.run({scope: fixture}),
        { elements: [], result: axs.constants.AuditResult.PASS });
});

test('a hidden link should not be run against the audit', function() {
    var fixture = document.getElementById('qunit-fixture');
    var a = document.createElement('a');
    a.hidden = true;
    a.href = '#main';
    a.textContent = 'Learn more about trout fishing';
    fixture.appendChild(a);
    var rule = axs.AuditRules.getRule('linkWithUnclearPurpose');
    deepEqual(
      rule.run({scope: fixture}),
      { result: axs.constants.AuditResult.NA });
});
