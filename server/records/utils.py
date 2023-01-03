
def latest_record_for_event(queryset):
    """
    Given a list of dictionaries with an even type, return
    the latest object per event type
    """
    filtered_list = []
    tempEventDict = {}
    # loop through the query set and assign the event as a key
    # in the tempEventDict and assigned either the first record
    # as the value or, if there's already a record assigned, see
    # if the current item's date is newer than the one assigned,
    # if it is, replace the assigned record with the current item
    for item in queryset:
        if item.event in tempEventDict:
            if item.date > tempEventDict[item.event].date:
                tempEventDict[item.event] = item
        else:
            tempEventDict[item.event] = item

    # once the tempEventDict has the latest record for all the
    # events, append all the values to the filtered_list list
    # and return it
    for key in tempEventDict:
        filtered_list.append(tempEventDict[key])

    return filtered_list
