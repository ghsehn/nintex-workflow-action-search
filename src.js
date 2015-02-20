(function() {
    'use strict'

    var instructions =
        'Usage instructions:\n\n' +
        '- Right click an action on the Workflow Actions sidebar to highlight the action instances in the workflow (' +
        'hold down shift key while clicking to maintain the already highlighted items).\n\n' +
        '- Hold down alt key and press the directional up and down keys to navigate between the highlighted items.\n\n' +
        '- Press esc key to remove the highlight from the items.'

    if (window.nintexSearchActivated) {
        alert(instructions)
        return
    }

    function onload() {
        $(function() {
            var $toolbox = $('#ActivityToolbox')

            if (!$toolbox.length) {
                alert('Error: Nintex Workflow not detected in this page.')
                return
            }

            window.nintexSearchActivated = true
            alert(instructions)

            $('<style>' +
                '.search-item-highlight { box-shadow: 0 0 20px red; border-color: red !important }' +
                '.search-item-highlight.search-item-selected { box-shadow: 0 0 20px green; border-color: green !important }' +
            '</style>').appendTo('head')

            $toolbox.on('contextmenu', '.activityItemCentered', function(e) {
                var type = $(this).find('img').attr('activitytype')

                if (!e.shiftKey)
                    $('.search-item-highlight').removeClass('search-item-highlight')

                $('.ActivityZone[activityid="' + type + '"]').each(function() {
                    $(this).find('.activityIconTable:first').addClass('search-item-highlight')
                })

                e.preventDefault()
            })

            $(document).keyup(function(e) {
                if (e.keyCode == 27) {
                    $('.search-item-highlight').removeClass('search-item-highlight')
                    $('.search-item-selected').removeClass('search-item-selected')
                } else if (e.altKey && (e.keyCode == 40 || e.keyCode == 38)) {
                    var $selected = $('.search-item-selected'),
                        $reset = null

                    if (!$selected.length) {
                        $selected = $('.search-item-highlight:first').addClass('search-item-selected')
                    } else {
                        var selectNext = false,
                            $toBeSelected = null

                        if (e.keyCode == 40) {
                            $('.search-item-highlight').each(function() {
                                if (selectNext) {
                                    $toBeSelected = $(this)
                                    return false
                                }

                                if ($(this).hasClass('search-item-selected')) {
                                    selectNext = true
                                }
                            })

                            $reset = $('.search-item-highlight:first')
                        } else {
                            $('.search-item-highlight').each(function() {
                                if ($(this).hasClass('search-item-selected')) {
                                    return false
                                }

                                $toBeSelected = $(this)
                            })

                            $reset = $('.search-item-highlight:last')
                        }

                        $selected.removeClass('search-item-selected')

                        $selected = $toBeSelected ? $toBeSelected : $reset
                        $selected.addClass('search-item-selected')
                    }

                    if ($selected.length) {
                        $('#totalCanvas').animate({
                            scrollTop: $('#totalCanvas').scrollTop() + $selected.offset().top - 200
                        }, {
                            duration: 200,
                            queue: false
                        })
                    }
                }
            })
        })
    }

    if (!window.jQuery) {
        var head = document.getElementsByTagName('head')[0] // document.head does not work in ie 8
        var s = document.createElement('script')
        s.src = 'https://code.jquery.com/jquery-1.11.2.min.js'
        s.type = 'text/javascript'
        head.appendChild(s)

        var checkReady = function() {
            if (window.jQuery) {
                onload()
            } else {
                setTimeout(checkReady, 10)
            }
        }

        checkReady()
    } else {
        onload()
    }
})()