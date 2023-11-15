// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

class Icon {
  constructor() {}

  setGray() {
    chrome.action.setTitle({ title: 'Нет новых уведомлений' });
    chrome.action.setIcon({ path: { 32: 'images/gray32.png' } });
  }
  
  setRed() {
    chrome.action.setTitle({ title: 'Новые шевеления есть!' });
    chrome.action.setIcon({ path: { 32: 'images/red32new.png' } });
  }
  
  setGreen() {
    chrome.action.setIcon({ path: { 32: 'images/green32.png' } });
  }
}

export default new Icon();
