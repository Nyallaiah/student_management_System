# Implementation Plan - Manage Profile & Manage Marks

## Task: Admin can add Subject, Credit, Marks, Grade, Status - Reflect to Student

## Phase 1: Backend Updates
- [x] 1.1 Update student_model.py - Add credits, grade, status to marks structure
- [x] 1.2 Add grade calculation helper function

## Phase 2: Admin Frontend - ManageMarks.jsx
- [x] 2.1 Add Credits field in marks table
- [x] 2.2 Add Grade field (auto-calculated but editable)
- [x] 2.3 Add Status field (Pass/Fail dropdown)
- [x] 2.4 Save all fields to backend

## Phase 3: Student Frontend - StudentMarks.jsx
- [x] 3.1 Read credits, grade, status from backend API
- [x] 3.2 Fallback to calculation if not present

## Phase 4: Testing
- [x] 4.1 Test admin can add/edit Subject, Credit, Marks, Grade, Status
- [x] 4.2 Test student can view their marks with all fields

## Completion
- [x] All functionality working end-to-end

