import React from 'react';
import * as PropTypes from 'prop-types';
import { DatePicker as KendoDatePicker } from '@progress/kendo-react-dateinputs';
import { Popup } from '@progress/kendo-react-popup';
import { FieldWrapper } from '@progress/kendo-react-form';
import { Label, Error, Hint } from '@progress/kendo-react-labels';

export const Datepicker = (fieldRenderProps) => {
  const {
    validationMessage,
    touched,
    label,
    id,
    valid,
    disabled,
    value,
    onChange,
    hint,
    type,
    optional,
    markRequired,
    dontConvert,
    resetTime,
    ...others
  } = fieldRenderProps;

  const showValidationMessage = touched && validationMessage;
  const showHint = !showValidationMessage && hint;
  const hintId = showHint ? `${id}_hint` : '';
  const errorId = showValidationMessage ? `${id}_error` : '';
  const [timeValue, setTimeValue] = React.useState(
    value ? new Date(value) : null
  );
  const ref = React.useRef(null);

  // Note : dont make this component completely controlled. known kendo issue.
  React.useEffect(() => {
    if (value) {
      let time = value ? new Date(value) : null;
      if (!timeValue) {
        setTimeValue(time);
      }
    }
  }, [value]);

  const onChangeHandler = (event) => {
    setTimeValue(event.value);
    let time = event.value;

    if (resetTime) {
      onChange({ value: formatTimeToMidnight(event.value) });
    } else if (dontConvert) {
      onChange(event);
    } else {
      /*
             * I don't know why STT added converting getTimeWithoutDeviation but it doesn't work correctly on File Upload page 
             * the date goes back one day:
             * - Edit 10/10/2023 on the line item (not the column header)
               - Edit the description (or any other column - File Name, Facility, File Type, File Application, Tags, Regulator)
               - Notice the date goes back one day to 10/09/2023
            * I think it can be related to "T00:00" on the date string specifies that the time is at midnight in local time, not UTC
             */
      onChange({
        value: getTimeWithoutDeviation(time)
          ? getTimeWithoutDeviation(time)
          : null,
      });
    }
  };

  const formatTimeToMidnight = (dateString) => {
    /* DatePicker by default is returning DateTime values with Timezone information

            Examples
            2021-12-12T00:00:00 represents December 12, 2021, at midnight (00:00:00) in Coordinated Universal Time (UTC).
            2020-12-11T18:30:00.000Z represents December 11, 2020, at 6:30:00 PM (18:30:00) in Coordinated Universal Time (UTC).

            Explanation
            The "Z" at the end of the second timestamp (2020-12-11T18:30:00.000Z) indicates that the time is in UTC (Coordinated Universal Time). The absence of the "Z" in the first timestamp (2021-12-12T00:00:00) suggests that the time is not explicitly specified in a particular timezone but is often interpreted as local time.
        */
    // Create a new Date object
    const date = new Date(dateString);
    // Set time to midnight
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    // Convert the Date object to ISO string
    return date.toISOString().slice(0, 19);
  };

  const getTimeWithoutDeviation = (date) => {
    const time = new Date(date).getTime();
    const zone = new Date().getTimezoneOffset() * 60000;
    if (date && date != 'Invalid Date') {
      var final = new Date(time - zone).toISOString().substring(0, 19);
      return final;
    } else {
      return null;
    }
  };

  const handleFocus = (e) => {
    e.target.dataset.changeFocusFlag = 0;
  };

  const datePickerRefCallback = React.useCallback((datePicker) => {
    if (datePicker?._dateInput?.current?.element) {
      ref.current = datePicker?._dateInput?.current;
      datePicker?._dateInput?.current?.element.addEventListener(
        'keydown',
        handleKeydown,
        false
      );
    }
  }, []);

  const switchDateSegment = () => {
    setTimeout(function () {
      if (ref?.current != null) {
        /*   @ts-ignore*/
        ref.current.switchDateSegment(1);
      }
    }, 100);
  };

  const handleKeydown = (e) => {
    const key = parseInt(e.key);
    // Handle the keydown event of the DatePicker.
    // In the keydown event handler, based on a condition, manually trigger the keydown event of the right arrow.
    if (key >= 0) {
      let changeFocusFlag = parseInt(e.target.dataset.changeFocusFlag ?? 0);
      changeFocusFlag++;
      if (changeFocusFlag === 2) {
        switchDateSegment();
        e.target.dataset.changeFocusFlag = 0;
      } else {
        e.target.dataset.changeFocusFlag = changeFocusFlag;
      }
    }
  };

  return (
    <FieldWrapper>
      <Label
        editorId={id}
        editorValid={valid}
        editorDisabled={disabled}
        optional={optional}
      >
        {label}
        {markRequired && <span className="required-label">*</span>}
      </Label>
      <div className={'k-form-field-wrap'}>
        <KendoDatePicker
          valid={valid}
          id={id}
          disabled={disabled}
          ariaDescribedBy={`${hintId} ${errorId}`}
          format="MM/dd/yyyy"
          value={timeValue}
          onChange={onChangeHandler}
          onFocus={handleFocus}
          ref={datePickerRefCallback}
          popup={
            Popup
          } /* For some reason, specifying the Popup this way corrects an issue it has popping behind modal windows. */
          {...others}
        />
        {showHint && <Hint id={hintId}>{hint}</Hint>}
        {showValidationMessage && (
          <Error id={errorId}>{validationMessage}</Error>
        )}
      </div>
    </FieldWrapper>
  );
};

Datepicker.displayName = 'Datepicker';
Datepicker.propTypes = {
  valid: PropTypes.bool,
  value: PropTypes.string,
  id: PropTypes.string,
  optional: PropTypes.bool,
  label: PropTypes.string,
  hint: PropTypes.string,
  validationMessage: PropTypes.string,
  visited: PropTypes.bool,
};
