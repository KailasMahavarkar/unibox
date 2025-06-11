# AWS PFM Chatbot API Integration

## Objective
Integrate the production AWS PFM data queries API POST request hitting (https://7hn0iksiy0.execute-api.ap-south-1.amazonaws.com/prod/chat) into the existing unibox Next.js application chatbot functionality. Replace mock data with real API calls using a single axios service for chatbot communication, maintaining the existing right-side chatbot UI while connecting to the AWS endpoint that accepts `message: ""` in the request body.

## Implementation Plan

1. **Environment Setup and Dependencies**
   - Dependencies: None
   - Notes: Add HTTP client for API communication, create service architecture
   - Files: `/package.json`, `/src/services/api/`
   - Status: Not Started

2. **Create Centralized API Service Layer**
   - Dependencies: Task 1
   - Notes: Single service for chatbot API calls with error handling and timeout logic
   - Files: `/src/services/api/chatbot-service.ts`, `/src/types/chatbot.ts`
   - Status: Not Started

3. **Remove Mock Data from Main Chatbot Component**
   - Dependencies: Task 2
   - Notes: Clean hardcoded PFM responses from floating chatbot widget, preserve UI structure
   - Files: `/src/components/chatbot.tsx`
   - Status: Not Started

4. **Update Full Chat Page Implementation**
   - Dependencies: Task 2
   - Notes: Replace comprehensive mock responses with real API integration in dedicated chat page
   - Files: `/src/app/chat/page.tsx`
   - Status: Not Started

5. **Update Products Page Chat Integration**
   - Dependencies: Task 2
   - Notes: Connect embedded chat section to real API service, maintain existing layout
   - Files: `/src/app/products/page.tsx`
   - Status: Not Started

6. **Implement Robust Error Handling and Loading States**
   - Dependencies: Tasks 3, 4, 5
   - Notes: Add loading indicators, error states, retry mechanisms for production readiness
   - Files: All chatbot components, API service
   - Status: Not Started

7. **API Response Processing and Format Handling**
   - Dependencies: Task 6
   - Notes: Handle response transformation, ensure compatibility with existing UI rendering patterns
   - Files: `/src/services/api/chatbot-service.ts`, component files
   - Status: Not Started

8. **Testing and Integration Validation**
   - Dependencies: Task 7
   - Notes: Comprehensive testing of API integration, error scenarios, and user experience validation
   - Files: All modified components and services
   - Status: Not Started

## Verification Criteria
- All hardcoded mock responses removed from chatbot-related files
- Single API service successfully communicating with AWS endpoint
- Consistent chatbot behavior across all implementations (floating widget, full page, embedded)
- Proper error handling and loading states implemented
- No authentication required (as specified in requirements)
- Original UI/UX preserved while using real API data
- API calls use correct request format with `message: ""` structure

## Potential Risks and Mitigations

1. **AWS API Authentication/Access Issues**
   Mitigation: Implement flexible service layer that can accommodate authentication headers when details become available; create fallback error messaging system

2. **Response Format Incompatibility**
   Mitigation: Build response transformation layer to maintain existing formatted display; implement gradual response processing with format detection

3. **API Reliability and Performance**
   Mitigation: Implement timeout handling, retry logic, and graceful degradation; add loading states and error recovery mechanisms

4. **CORS and Network Configuration**
   Mitigation: Implement proper error handling for network issues; document configuration requirements for deployment environments

5. **Breaking Changes to Existing Functionality**
   Mitigation: Preserve existing component interfaces; implement changes incrementally with thorough testing at each stage

## Alternative Approaches

1. **Native Fetch vs Axios**: Use browser's native fetch API instead of axios to reduce dependencies and bundle size while maintaining the same functionality

2. **Service Worker Integration**: Implement service worker for offline chatbot capabilities and request caching to improve user experience during network issues

3. **WebSocket Connection**: Consider upgrading to WebSocket-based real-time communication for better performance, though this would require backend changes

4. **Incremental Migration**: Implement hybrid approach where specific message types use real API while others fall back to curated responses, allowing gradual transition

5. **Response Caching Layer**: Add intelligent caching mechanism to reduce API calls for frequently asked questions while maintaining real-time capabilities for dynamic queries