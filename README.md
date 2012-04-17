# Scrollify.js – a jQuery plugin for a custom scrollbar

Developed for Mass Relevance as a way to have a comprehensive custom scrollbar solution that supports mouse interaction, 
wheel movement, and touch devices.

There currently is not documentation, so if you get a chance please write some.

## Contact

Follow me on twitter @encryptomike

## Usage

Scrollify can be used in two distinct ways:

### Define the all of the required elements in your HTML
### Define the content area and have Scrollify generate the component

## Optional Parameters

*touch_enable* (boolean)
Default: true, Allow Scrollify to react to touch events

*wheel_enable*  (boolean)
Default: true, Allow Scrollify to react to mouse wheel events

*bar_enable*  (boolean)
Default: true, Show and enable the scrollbar

*handle_resize*  (boolean)
Default: true, The Scrollbar handle will resize to the container/content ratio

*auto_generate*  (boolean)
Default: false, Scrollify will automatically generate the required components

*class_bar* (string)
Default: scrollbar, The default class for the scrollbar element

*class_handle* (string)
Default: handle, The default class for the scrollbar handle element

*class_content* (string)
Default: content, The default class for the content container element

*job_interval* (int)
Default: 250, The number of milliseconds to run the job interval