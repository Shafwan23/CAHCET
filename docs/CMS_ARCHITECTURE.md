# CMS Architecture

## Overview
The Enterprise CMS allows dynamic control over JSON payload trees without touching source code.

## Core Components
- **`EditorPage.jsx`:** The HOC (Higher Order Component) wrapper that manages the Draft/Review/Publish lifecycle for any specific page slug.
- **`TwoPanelLayout.jsx`:** The UI scaffold providing a sidebar of content blocks and a main editing workspace.
- **`SectionPreviewModal.jsx`:** The Live Preview Engine. It takes the uncommitted Draft JSON from the editor and temporarily mounts the actual Public Website component using those props.

## Shared Data Flow
1. **Load:** Editor mounts -> Calls `cmsService.getPage('slug')` -> Populates local state.
2. **Edit:** Local state changes.
3. **Draft:** Editor clicks save -> Calls `cmsService.saveDraft('slug', data)` -> Backend stores JSON in DB under `status: DRAFT`.
4. **Publish:** Admin clicks publish -> Calls `cmsService.publishPage('slug')` -> Backend promotes DRAFT to PUBLISHED.

Every module (Departments, About, Homepage) inherently inherits this exact stability because they all wrap `EditorPage`.
