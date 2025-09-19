import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Clock, BookOpen, CheckCircle } from 'lucide-react';

export function TableOfContents({ post }) {
  const [activeSection, setActiveSection] = useState('');
  const [readingSections, setReadingSections] = useState(new Set());
  const [isExpanded, setIsExpanded] = useState(true);
  const observerRef = useRef();

  // Extract headings from post content
  const headings = post.content.filter(item => item.type === 'heading').map(heading => ({
    id: heading.id,
    text: heading.data?.text || 'Untitled Section',
    level: heading.data?.level || 1
  }));

  // Calculate reading time for each section
  const getSectionContent = (headingIndex) => {
    const currentHeading = headings[headingIndex];
    const nextHeading = headings[headingIndex + 1];
    
    const currentIndex = post.content.findIndex(item => item.id === currentHeading.id);
    const nextIndex = nextHeading ? 
      post.content.findIndex(item => item.id === nextHeading.id) : 
      post.content.length;
    
    return post.content.slice(currentIndex + 1, nextIndex);
  };

  const calculateSectionReadingTime = (sectionContent) => {
    const wordsPerMinute = 200;
    let wordCount = 0;
  
    sectionContent.forEach(item => {
      console.log("item", JSON.stringify(item, null, 2));
  
      if (item.type === 'paragraph' && item.data?.text) {
        // count words in a simple paragraph
        wordCount += item.data.text.trim().split(/\s+/).length;
      } 
      
      else if (item.type === 'list' && item.data?.items) {
        // loop through list items
        item.data.items.forEach(listItem => {
          // count title text if present
          if (listItem.title) {
            wordCount += listItem.title.trim().split(/\s+/).length;
          }
  
          // count words inside paragraphs
          if (listItem.paragraphs) {
            listItem.paragraphs.forEach(p => {
              if (p.text) {
                wordCount += p.text.trim().split(/\s+/).length;
              }
            });
          }
        });
      }
    });
  
    return Math.ceil(wordCount / wordsPerMinute);
  };
  

  // Enhanced sections with reading time
  const enhancedHeadings = headings.map((heading, index) => {
    const sectionContent = getSectionContent(index);
    const readingTime = calculateSectionReadingTime(sectionContent);
    const isRead = readingSections.has(heading.id);
    
    return {
      ...heading,
      readingTime,
      isRead,
      contentCount: sectionContent.length
    };
  });

  // Calculate overall progress
  const totalSections = enhancedHeadings.length;
  const readSections = readingSections.size;
  const progressPercentage = totalSections > 0 ? (readSections / totalSections) * 100 : 0;
  const totalReadingTime = enhancedHeadings.reduce((total, heading) => total + heading.readingTime, 0);
  const remainingTime = enhancedHeadings
    .filter(heading => !heading.isRead)
    .reduce((total, heading) => total + heading.readingTime, 0);

  // Scroll to section
  const scrollToSection = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(headingId);
    }
  };

  // Mark section as read when user scrolls to it
  useEffect(() => {
    const handleScroll = () => {
      headings.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight * 0.3) {
            setActiveSection(heading.id);
            setReadingSections(prev => new Set([...prev, heading.id]));
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const getIndentLevel = (level) => {
    return level === 1 ? 'ml-0' : level === 2 ? 'ml-4' : 'ml-8';
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      {/* Header with toggle */}
      <div 
        className="flex items-center justify-between p-4 border-b cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Table of Contents</h3>
        </div>
        {isExpanded ? 
          <ChevronDown className="w-4 h-4 text-gray-400" /> : 
          <ChevronRight className="w-4 h-4 text-gray-400" />
        }
      </div>

      {isExpanded && (
        <>
          {/* Progress Overview */}
          <div className="p-4 border-b bg-gray-50">
            <div className="space-y-3">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{Math.round(progressPercentage)}% complete</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 transition-all duration-300 bg-green-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Reading Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">{remainingTime}m left</div>
                    <div className="text-gray-500">of {totalReadingTime}m total</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900">{readSections}/{totalSections}</div>
                    <div className="text-gray-500">sections read</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="p-4">
            <div className="space-y-1 overflow-y-auto max-h-80">
              {enhancedHeadings.map((heading, index) => (
                <div
                  key={heading.id}
                  className={`
                    group cursor-pointer rounded-md p-2 text-sm transition-all duration-200
                    ${getIndentLevel(heading.level)}
                    ${activeSection === heading.id 
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500' 
                      : 'hover:bg-gray-50 text-gray-700'
                    }
                  `}
                  onClick={() => scrollToSection(heading.id)}
                >
                  <div className="flex items-start justify-between space-x-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {heading.isRead && (
                          <CheckCircle className="flex-shrink-0 w-3 h-3 text-green-500" />
                        )}
                        <span className={`
                          truncate font-medium
                          ${heading.level === 1 ? 'text-sm' : 'text-xs'}
                          ${heading.isRead ? 'line-through text-gray-500' : ''}
                        `}>
                          {heading.text}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center flex-shrink-0 space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{heading.readingTime}m</span>
                    </div>
                  </div>
                  
                  {/* Section preview on hover */}
                  <div className="mt-1 text-xs text-gray-500 transition-opacity opacity-0 group-hover:opacity-100">
                    {heading.contentCount} items in this section
                  </div>
                </div>
              ))}
            </div>

            {headings.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No headings found in this post</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {readSections > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => setReadingSections(new Set())}
                className="w-full px-3 py-2 text-sm text-gray-600 transition-colors rounded hover:text-gray-800 hover:bg-gray-100"
              >
                Reset Progress
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}