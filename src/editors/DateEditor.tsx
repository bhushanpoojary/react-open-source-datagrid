// DateEditor - Date and time picker editor with calendar popup

import React, { useState, useRef, useMemo } from 'react';
import type { DataGridEditorProps } from './editorTypes';
import {
  useEditorKeyboardNavigation,
  useEditorAutoFocus,
  useEditorClickOutside,
  usePopupPosition,
} from './editorUtils';
import './editors.css';

export interface DateEditorProps<TRow = any>
  extends DataGridEditorProps<string | Date | null, TRow> {
  /** Date format string (e.g., "yyyy-MM-dd", "MM/dd/yyyy") */
  dateFormat?: string;
  
  /** Show time picker in addition to date */
  showTime?: boolean;
  
  /** Minimum selectable date */
  minDate?: Date;
  
  /** Maximum selectable date */
  maxDate?: Date;
  
  /** Auto-commit when date is selected */
  autoCommit?: boolean;
}

/**
 * DateEditor component for DataGrid cells.
 * Provides a calendar popup for date selection with optional time picker.
 */
export function DateEditor<TRow = any>(
  props: DateEditorProps<TRow>
): React.ReactElement {
  const {
    value,
    onChange,
    onCommit,
    onCancel,
    autoFocus = true,
    dateFormat = 'yyyy-MM-dd',
    showTime = false,
    minDate,
    maxDate,
    autoCommit = false,
  } = props;

  const [isOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [viewDate, setViewDate] = useState<Date>(new Date());
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useEditorAutoFocus<HTMLInputElement>(autoFocus, true);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Parse initial value
  const parsedValue = useMemo(() => {
    if (!value) return null;
    if (value instanceof Date) return value;
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }, [value]);

  // Initialize input value
  React.useEffect(() => {
    if (parsedValue) {
      setInputValue(formatDate(parsedValue, dateFormat, showTime));
      setViewDate(parsedValue);
    }
  }, [parsedValue, dateFormat, showTime]);

  // Position calendar
  usePopupPosition(containerRef, calendarRef, isOpen, 'auto');

  // Handle click outside
  useEditorClickOutside(containerRef, () => {
    if (isOpen) {
      onCommit();
    }
  }, true);

  // Handle date selection
  const handleSelectDate = (date: Date) => {
    const newDate = new Date(date);
    
    // If we have an existing time and we're in date-only mode, preserve it
    if (parsedValue && !showTime) {
      newDate.setHours(parsedValue.getHours());
      newDate.setMinutes(parsedValue.getMinutes());
      newDate.setSeconds(parsedValue.getSeconds());
    }
    
    onChange(newDate as any);
    setInputValue(formatDate(newDate, dateFormat, showTime));
    
    if (autoCommit && !showTime) {
      onCommit();
    }
  };

  // Handle time change
  const handleTimeChange = (hours: number, minutes: number) => {
    const newDate = parsedValue ? new Date(parsedValue) : new Date();
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onChange(newDate as any);
    setInputValue(formatDate(newDate, dateFormat, showTime));
  };

  // Handle manual input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const parsed = parseDate(newValue, dateFormat);
    if (parsed && !isNaN(parsed.getTime())) {
      onChange(parsed as any);
      setViewDate(parsed);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    if (parsedValue) {
      setInputValue(formatDate(parsedValue, dateFormat, showTime));
    }
  };

  // Navigate month
  const handlePrevMonth = () => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Keyboard navigation
  const { handleKeyDown } = useEditorKeyboardNavigation(
    {
      onEnter: onCommit,
      onEscape: onCancel,
    },
    {
      commitOnTab: true,
      commitOnBlur: false,
    }
  );

  // Generate calendar days
  const calendarDays = useMemo(() => {
    return generateCalendarDays(viewDate, parsedValue, minDate, maxDate);
  }, [viewDate, parsedValue, minDate, maxDate]);

  return (
    <div
      ref={containerRef}
      className="editor-container editor-date-container"
      onKeyDown={handleKeyDown}
    >
      <div className="editor-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="editor-input editor-date-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={dateFormat}
          aria-label="Date input"
          autoComplete="off"
        />
        <span className="editor-calendar-icon" aria-hidden="true">
          📅
        </span>
      </div>

      {isOpen && (
        <div ref={calendarRef} className="editor-dropdown editor-calendar">
          <div className="editor-calendar-header">
            <button
              type="button"
              className="editor-calendar-nav"
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              ‹
            </button>
            <div className="editor-calendar-title">
              {viewDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <button
              type="button"
              className="editor-calendar-nav"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className="editor-calendar-weekdays">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="editor-calendar-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="editor-calendar-days">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                type="button"
                className={`editor-calendar-day ${day.className}`}
                onClick={() => day.date && handleSelectDate(day.date)}
                disabled={day.disabled}
                aria-label={day.date ? day.date.toDateString() : ''}
              >
                {day.label}
              </button>
            ))}
          </div>

          {showTime && (
            <div className="editor-calendar-time">
              <input
                type="time"
                className="editor-time-input"
                value={
                  parsedValue
                    ? `${String(parsedValue.getHours()).padStart(2, '0')}:${String(
                        parsedValue.getMinutes()
                      ).padStart(2, '0')}`
                    : '00:00'
                }
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  handleTimeChange(hours, minutes);
                }}
                aria-label="Time input"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

DateEditor.displayName = 'DateEditor';

// Helper functions

function formatDate(date: Date, format: string, showTime: boolean): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  let formatted = format
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day);

  if (showTime) {
    formatted += ` ${hours}:${minutes}`;
  }

  return formatted;
}

function parseDate(value: string, format: string): Date | null {
  if (!value) return null;

  try {
    // Simple parsing - support common formats
    const parts = value.split(/[-/\s:]/);
    if (parts.length < 3) return null;

    let year: number, month: number, day: number;
    let hours = 0, minutes = 0;

    if (format.startsWith('yyyy')) {
      // yyyy-MM-dd
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    } else if (format.startsWith('MM')) {
      // MM/dd/yyyy
      month = parseInt(parts[0], 10) - 1;
      day = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    } else {
      // dd/MM/yyyy
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      year = parseInt(parts[2], 10);
    }

    if (parts.length >= 5) {
      hours = parseInt(parts[3], 10);
      minutes = parseInt(parts[4], 10);
    }

    const date = new Date(year, month, day, hours, minutes);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

interface CalendarDay {
  date: Date | null;
  label: string;
  className: string;
  disabled: boolean;
}

function generateCalendarDays(
  viewDate: Date,
  selectedDate: Date | null,
  minDate?: Date,
  maxDate?: Date
): CalendarDay[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const days: CalendarDay[] = [];
  
  // Previous month's trailing days
  const prevMonth = new Date(year, month, 0);
  const prevMonthDays = prevMonth.getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthDays - i);
    days.push({
      date,
      label: String(prevMonthDays - i),
      className: 'other-month',
      disabled: isDateDisabled(date, minDate, maxDate),
    });
  }
  
  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isToday = isSameDay(date, new Date());
    const disabled = isDateDisabled(date, minDate, maxDate);
    
    days.push({
      date,
      label: String(i),
      className: `${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${
        disabled ? 'disabled' : ''
      }`.trim(),
      disabled,
    });
  }
  
  // Next month's leading days
  const remainingDays = 42 - days.length; // 6 rows × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      label: String(i),
      className: 'other-month',
      disabled: isDateDisabled(date, minDate, maxDate),
    });
  }
  
  return days;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date
): boolean {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  return false;
}
