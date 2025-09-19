'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Type, Bold, Italic, List, ListOrdered, Link2,
  Image, Table2, AlignLeft, AlignCenter, AlignRight,
  Heading1, Heading2, Heading3, Quote, Eye, Code, Underline,
  Palette, Download, Upload
} from "lucide-react";

import type { Category, PostTemplate, Tag } from "@/pages/admin/posts/new";

interface CreatePostFormProps {
  templates: PostTemplate[];
  categories: Category[];
  tags: Tag[];
}

const JOB_TEMPLATES = {
  'government-job': {
    name: 'Government Job Notification',
    content: `<div class="job-notification" style="line-height: 1.6; color: #333;">
  
  <div class="header-section" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 25px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
    <h1 style="margin: 0; font-weight: bold;">[POST TITLE - e.g. HSSC Clerk Recruitment 2024]</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">[TOTAL POSTS] Posts | Apply Online | Last Date: [LAST DATE]</p>
  </div>

  <div class="introduction" style="background: #f0f9ff; border-left: 5px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 5px;">
    <p style="margin: 0; line-height: 1.7;">
      <strong>[DEPARTMENT NAME]</strong> has released an official notification for <strong>[NUMBER]</strong> posts of <strong>[POST NAME]</strong>. 
      Interested and eligible candidates can apply online through the official website. Read the complete notification for 
      eligibility criteria, application process, important dates, and other details.
    </p>
  </div>

  <div class="post-details" style="background: white; border: 2px solid #e5e7eb; border-radius: 10px; overflow: hidden; margin: 30px 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    
    <div class="details-header" style="background: #1e40af; color: white; padding: 20px; text-align: center;">
      <h2 style="margin: 0;">[POST TITLE] - Quick Overview</h2>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">Advertisement No: [ADVT NO] | Official Website: [WEBSITE]</p>
    </div>

    <div class="details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0; min-height: 400px;">
      
      <!-- Important Dates Section -->
      <div class="dates-section" style="padding: 25px; border-right: 2px solid #e5e7eb; background: #fafafa;">
        <h3 style="color: #dc2626; margin: 0 0 20px 0; display: flex; align-items: center; border-bottom: 2px solid #fee2e2; padding-bottom: 10px;">
          📅 Important Dates
        </h3>
        ...
      </div>

      <!-- Application Fees Section -->
      <div class="fees-section" style="padding: 25px; background: white;">
        <h3 style="color: #dc2626; margin: 0 0 20px 0; display: flex; align-items: center; border-bottom: 2px solid #fee2e2; padding-bottom: 10px;">
          💰 Application Fees
        </h3>
        ...
      </div>
    </div>
  </div>

  <!-- Additional Information Sections -->
  <div class="additional-info" style="margin: 40px 0;">
    
    <!-- Post Details Table -->
    <div class="section" style="margin: 30px 0;">
      <h3 style="color: #1e40af; margin: 0 0 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 5px solid #3b82f6;">
        📋 Post Details
      </h3>
      ...
    </div>

    <!-- Eligibility Criteria -->
    <div class="section" style="margin: 30px 0;">
      <h3 style="color: #1e40af; margin: 0 0 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 5px solid #3b82f6;">
        🎓 Eligibility Criteria
      </h3>
      ...
    </div>

    <!-- How to Apply -->
    <div class="section" style="margin: 30px 0;">
      <h3 style="color: #1e40af; margin: 0 0 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 5px solid #3b82f6;">
        📝 How to Apply Online
      </h3>
      <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 25px;">
        <ol style="line-height: 2; color: #374151; padding-left: 20px;">
          <li><strong>Visit Official Website:</strong> Go to <a href="[WEBSITE URL]" style="color: #3b82f6; text-decoration: none; font-weight: 600;">[WEBSITE NAME]</a></li>
          ...
        </ol>
      </div>
    </div>

    <!-- Important Links -->
    <div class="section" style="margin: 30px 0;">
      <h3 style="color: #1e40af; margin: 0 0 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 5px solid #3b82f6;">
        🔗 Important Links
      </h3>
      ...
    </div>

    <!-- Disclaimer -->
    <div class="disclaimer" style="background: #fef2f2; border: 2px solid #fecaca; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
      <h4 style="color: #dc2626; margin: 0 0 10px 0;">⚠️ Important Disclaimer</h4>
      <p style="margin: 0; color: #dc2626; line-height: 1.6;">
        Please read the official notification carefully before applying. <strong>Haryana Job Alert</strong> is not responsible for any errors or changes. 
        Always verify information from official sources. This website only provides information for educational purposes.
      </p>
    </div>
  </div>
</div>
`
  },
  'exam-result': {
    name: 'Exam Result Declaration',
    content: `<div class="result-notification" style="line-height: 1.6; color: #333;">
  
  <div class="header-section" style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 25px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
    <h1 style="margin: 0; font-weight: bold;">[EXAM NAME] Result Declared</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Check Your Result Now | Merit List Available</p>
  </div>

  <div class="result-summary" style="background: #f0fdf4; border: 2px solid #bbf7d0; padding: 25px; border-radius: 10px; margin: 25px 0;">
    <h2 style="color: #166534; margin: 0 0 20px 0; text-align: center;">📊 Result Summary</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
      <div style="text-align: center; background: white; padding: 20px; border-radius: 10px; border: 2px solid #d1fae5; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="font-weight: bold; color: #16a34a; margin-bottom: 8px;">[TOTAL APPEARED]</div>
        <div style="color: #6b7280; font-weight: 600;">Total Candidates Appeared</div>
      </div>
      <div style="text-align: center; background: white; padding: 20px; border-radius: 10px; border: 2px solid #d1fae5; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="font-weight: bold; color: #16a34a; margin-bottom: 8px;">[TOTAL QUALIFIED]</div>
        <div style="color: #6b7280; font-weight: 600;">Total Qualified Candidates</div>
      </div>
      <div style="text-align: center; background: white; padding: 20px; border-radius: 10px; border: 2px solid #d1fae5; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="font-weight: bold; color: #16a34a; margin-bottom: 8px;">[PASS PERCENTAGE]%</div>
        <div style="color: #6b7280; font-weight: 600;">Overall Pass Percentage</div>
      </div>
    </div>
  </div>

  <!-- Cut-off Marks Section -->
  <div class="cutoff-section" style="margin: 30px 0;">
    <h3 style="color: #1e40af; margin: 0 0 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 5px solid #3b82f6;">
      🏆 Category-wise Cut-off Marks
    </h3>
    <div style="overflow-x: auto; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #1e40af; color: white;">
            <th style="padding: 15px; text-align: left; font-weight: bold;">Category</th>
            <th style="padding: 15px; text-align: center; font-weight: bold;">Cut-off Marks</th>
            <th style="padding: 15px; text-align: center; font-weight: bold;">Total Marks</th>
            <th style="padding: 15px; text-align: center; font-weight: bold;">Qualified</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #f8fafc;">
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">General/EWS</td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: #dc2626;">[CUT-OFF MARKS]</td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280;">[TOTAL MARKS]</td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: #16a34a;">[NUMBER]</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">OBC</td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: #dc2626;">[CUT-OFF MARKS]</td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280;">[TOTAL MARKS]</td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: #16a34a;">[NUMBER]</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">SC</td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: #dc2626;">[CUT-OFF MARKS]</td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280;">[TOTAL MARKS]</td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: #16a34a;">[NUMBER]</td>
          </tr>
          <tr>
            <td style="padding: 15px; font-weight: 600; color: #374151;">ST</td>
            <td style="padding: 15px; text-align: center; font-weight: bold; color: #dc2626;">[CUT-OFF MARKS]</td>
            <td style="padding: 15px; text-align: center; color: #6b7280;">[TOTAL MARKS]</td>
            <td style="padding: 15px; text-align: center; font-weight: bold; color: #16a34a;">[NUMBER]</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- How to Check Result -->
  <div class="check-result" style="margin: 30px 0;">
    <h3 style="color: #1e40af; margin: 0 0 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 5px solid #3b82f6;">
      🔍 How to Check Your Result
    </h3>
    <div style="background: white; border: 2px solid #e5e7eb; border-radius: 10px; padding: 25px;">
      <ol style="line-height: 2.2; color: #374151; padding-left: 20px;">
        <li><strong>Visit Official Website:</strong> Go to <a href="[WEBSITE URL]" style="color: #3b82f6; text-decoration: none; font-weight: 600;">[WEBSITE NAME]</a></li>
        ...
      </ol>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="action-buttons" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 30px 0;">
    <a href="[RESULT CHECK URL]" style="background: #16a34a; color: white; padding: 20px; text-decoration: none; border-radius: 10px; text-align: center; display: block; font-weight: bold;">
      📊 Check Result Online
    </a>
    <a href="[MERIT LIST URL]" style="background: #3b82f6; color: white; padding: 20px; text-decoration: none; border-radius: 10px; text-align: center; display: block; font-weight: bold;">
      📋 Download Merit List
    </a>
    <a href="[ANSWER KEY URL]" style="background: #dc2626; color: white; padding: 20px; text-decoration: none; border-radius: 10px; text-align: center; display: block; font-weight: bold;">
      🔑 Download Answer Key
    </a>
    <a href="[SCORECARD URL]" style="background: #7c3aed; color: white; padding: 20px; text-decoration: none; border-radius: 10px; text-align: center; display: block; font-weight: bold;">
      📜 Download Scorecard
    </a>
  </div>

  <!-- Next Steps -->
  <div class="next-steps" style="margin: 30px 0;">
    <h3 style="color: #1e40af; margin: 0 0 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 5px solid #3b82f6;">
      📋 Next Steps for Qualified Candidates
    </h3>
    <div style="background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 10px; padding: 25px;">
      <ul style="line-height: 2; color: #166534; padding-left: 20px;">
        <li><strong>Document Verification:</strong> [DATE] - Bring all original documents</li>
        ...
      </ul>
    </div>
  </div>

  <!-- Disclaimer -->
  <div class="disclaimer" style="background: #fef2f2; border: 2px solid #fecaca; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
    <h4 style="color: #dc2626; margin: 0 0 10px 0;">⚠️ Important Note</h4>
    <p style="margin: 0; color: #dc2626; line-height: 1.6;">
      This result information is for reference only. Please verify from the official website. 
      <strong>Haryana Job Alert</strong> is not responsible for any discrepancies.
    </p>
  </div>
</div>
`
  },
  'admit-card': {
    name: 'Admit Card Release Notification',
    content: `<div class="admit-card-notification" style="line-height: 1.6; color: #333;">
  
  <div class="header-section" style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 25px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
    <h1 style="margin: 0; font-weight: bold;">[EXAM NAME] Admit Card Released</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Download Now | Exam Date: [EXAM DATE]</p>
  </div>

  <div class="admit-card-details" style="background: #faf5ff; border: 2px solid #d8b4fe; padding: 25px; border-radius: 10px; margin: 25px 0;">
    <h2 style="color: #7c3aed; margin: 0 0 20px 0; text-align: center;">🎫 Admit Card Information</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
      <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #374151; width: 40%;">Exam Name:</td>
            <td style="padding: 10px 0; color: #7c3aed; font-weight: 600;">[EXAM NAME]</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #374151;">Exam Date:</td>
            <td style="padding: 10px 0; color: #dc2626; font-weight: 600;">[EXAM DATE]</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #374151;">Admit Card Release:</td>
            <td style="padding: 10px 0; color: #16a34a; font-weight: 600;">[RELEASE DATE]</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #374151;">Download Till:</td>
            <td style="padding: 10px 0; color: #dc2626; font-weight: 600;">[LAST DATE]</td>
          </tr>
        </table>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h4 style="color: #7c3aed; margin: 0 0 15px 0;">📋 Required Information</h4>
        <ul style="line-height: 1.8; color: #374151; padding-left: 20px; margin: 0;">
          <li>Registration Number</li>
          <li>Date of Birth (DD/MM/YYYY)</li>
          <li>Password (if applicable)</li>
          <li>Valid Email ID</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Download Steps -->
  <div class="download-steps" style="margin: 30px 0;">
    <h3 style="color: #1e40af; margin: 0 0 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 5px solid #3b82f6;">
      📥 How to Download Admit Card
    </h3>
    <div style="background: white; border: 2px solid #e5e7eb; border-radius: 10px; padding: 25px;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px;">
        <div style="order: 1;">
          <ol style="line-height: 2.2; color: #374151; padding-left: 20px;">
            <li><strong>Visit Official Website:</strong><br>
                Go to <a href="[WEBSITE URL]" style="color: #3b82f6; text-decoration: none; font-weight: 600;">[WEBSITE NAME]</a></li>
            <li><strong>Find Admit Card Section:</strong><br>
                Look for "Admit Card" or "Hall Ticket" menu</li>
            <li><strong>Select Your Exam:</strong><br>
                Click on "[EXAM NAME] Admit Card" link</li>
            <li><strong>Enter Registration Details:</strong><br>
                Input your Registration Number and Date of Birth</li>
            <li><strong>Click Submit:</strong><br>
                Verify details and click "Download" or "Submit"</li>
            <li><strong>Download PDF:</strong><br>
                Your admit card will open in PDF format</li>
            <li><strong>Take Printouts:</strong><br>
                Take multiple colored printouts for exam day</li>
          </ol>
        </div>
        <div style="order: 2; background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <h4 style="color: #92400e; margin: 0 0 15px 0;">⚡ Quick Tips</h4>
          <ul style="line-height: 1.8; color: #92400e; padding-left: 20px; margin: 0;">
            <li>Use Chrome or Firefox browser</li>
            <li>Check internet connection</li>
            <li>Keep registration details ready</li>
            <li>Download immediately after release</li>
            <li>Take printouts on good quality paper</li>
            <li>Keep backup copies safe</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Important Instructions -->
  <div class="instructions" style="margin: 30px 0;">
    <h3 style="color: #1e40af; margin: 0 0 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 5px solid #3b82f6;">
      📝 Important Exam Day Instructions
    </h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
      <div style="background: #fef2f2; border: 2px solid #fecaca; padding: 20px; border-radius: 8px;">
        <h4 style="color: #dc2626; margin: 0 0 15px 0;">🚫 Mandatory Requirements</h4>
        <ul style="line-height: 1.8; color: #dc2626; padding-left: 20px; margin: 0;">
          <li><strong>Original Admit Card:</strong> Signed by candidate</li>
          <li><strong>Valid Photo ID:</strong> Aadhaar/Passport/Driving License</li>
          <li><strong>Recent Photographs:</strong> Same as in application</li>
          <li><strong>Blue/Black Pen:</strong> For signature/writing</li>
        </ul>
      </div>
      <div style="background: #f0fdf4; border: 2px solid #bbf7d0; padding: 20px; border-radius: 8px;">
        <h4 style="color: #166534; margin: 0 0 15px 0;">✅ General Instructions</h4>
        <ul style="line-height: 1.8; color: #166534; padding-left: 20px; margin: 0;">
          <li><strong>Reach Early:</strong> 30 minutes before exam</li>
          <li><strong>Check Details:</strong> Verify all information on admit card</li>
          <li><strong>No Electronics:</strong> Mobile phones not allowed</li>
          <li><strong>Follow Guidelines:</strong> COVID protocols if applicable</li>
        </ul>
      </div>
      <div style="background: #f0f9ff; border: 2px solid #c7d2fe; padding: 20px; border-radius: 8px;">
        <h4 style="color: #3730a3; margin: 0 0 15px 0;">📞 Help & Support</h4>
        <ul style="line-height: 1.8; color: #3730a3; padding-left: 20px; margin: 0;">
          <li><strong>Helpline:</strong> [PHONE NUMBER]</li>
          <li><strong>Email:</strong> [EMAIL ADDRESS]</li>
          <li><strong>Timing:</strong> [SUPPORT HOURS]</li>
          <li><strong>Report Issues:</strong> Immediately to authorities</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Download Button -->
  <div style="text-align: center; margin: 40px 0;">
    <a href="[ADMIT CARD DOWNLOAD URL]" style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 20px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; box-shadow: 0 8px 16px rgba(124, 58, 237, 0.3); transition: all 0.3s;">
      🎫 Download Admit Card Now
    </a>
  </div>

  <!-- Disclaimer -->
  <div class="disclaimer" style="background: #fef2f2; border: 2px solid #fecaca; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
    <h4 style="color: #dc2626; margin: 0 0 10px 0;">⚠️ Important Disclaimer</h4>
    <p style="margin: 0; color: #dc2626; line-height: 1.6;">
      Candidates are advised to download admit card from official website only. Check all details carefully and report any discrepancy immediately. 
      <strong>Haryana Job Alert</strong> provides information for reference only.
    </p>
  </div>
</div>
`
  }
};

export function CreatePostForm({ templates, categories, tags }: CreatePostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("Click on a template to get started, or start typing here...");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [showHtmlCode, setShowHtmlCode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const router = useRouter();
  const [fontSize, setFontSize] = useState(16);
  const [draftSize, setDraftSize] = useState("16");
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        setSavedRange(range);

        // ✅ detect font size at cursor
        const parent = sel.anchorNode?.parentElement;
        if (parent) {
          const computed = window.getComputedStyle(parent);
          const sizePx = parseInt(computed.fontSize, 10);
          if (!isNaN(sizePx)) {
            setFontSize(sizePx);
            setDraftSize(String(sizePx));
          }
        }
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  function restoreSelection(savedRange?: Range) {
    if (savedRange) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange);
    }
  }

  const applyFontSize = (size: number) => {
    if (!savedRange) return;
    restoreSelection(savedRange); // ✅ reselect the text
    document.execCommand("fontSize", false, "7");

    const sel = window.getSelection();
    const parent = sel?.anchorNode?.parentElement;
    if (parent && parent.tagName === "FONT" && parent.getAttribute("size") === "7") {
      parent.removeAttribute("size");
      parent.style.fontSize = `${size}px`;
    }
  };


  // Utility: save & restore selection
  function saveSelection() {
    const sel = window.getSelection();
    return sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
  }

  // Prevent toolbar clicks from stealing focus and save selection instead
  const handleToolbarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // keep editor selection intact
    saveSelection();
  };

  // Enable content editing when component mounts
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    el.contentEditable = "true";
    el.style.outline = "none";
    el.dir = "ltr";
    el.style.direction = "ltr";
    // @ts-ignore
    el.style.unicodeBidi = "plaintext";

    // ✅ Force Chromium to use <p> for new lines
    document.execCommand("defaultParagraphSeparator", false, "p");

    if (el.innerHTML !== content) {
      el.innerHTML = content;
    }

    const handleInput = () => {
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    };

    el.addEventListener("input", handleInput);
    return () => el.removeEventListener("input", handleInput);
  }, []);

  // When switching back from HTML view, write content into DOM once and focus caret to end
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    if (!showHtmlCode) {
      el.contentEditable = "true";
      if (el.innerHTML !== content) {
        el.innerHTML = content;
      }
      el.focus();
    }
  }, [showHtmlCode]);

  // Exec command that restores selection & focuses editor first
  const execCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const formatBold = () => execCommand("bold");
  const formatItalic = () => execCommand("italic");
  const formatUnderline = () => execCommand("underline");

  const formatHeading = (level: number) => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, "h" + level);
    setContent(editorRef.current?.innerHTML || content);
  };

  const insertList = (ordered: boolean = false) => {
    editorRef.current?.focus();
    document.execCommand(ordered ? "insertOrderedList" : "insertUnorderedList");
    setContent(editorRef.current?.innerHTML || content);
  };

  const setAlignment = (align: string) => {
    execCommand(`justify${align}`);
  };

  const insertLink = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const url = prompt("Enter URL:");
    if (url) {
      const sel = window.getSelection();
      if (sel && sel.toString().length > 0) {
        execCommand("createLink", url);
      } else {
        execCommand("insertHTML", `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
      }
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) execCommand("insertImage", url);
  };

  // Flexible insertTable: prompt for rows and cols; cancel -> do nothing
  const insertTable = () => {
    const rowsRaw = prompt("Enter number of rows:");
    if (rowsRaw === null) return;
    const colsRaw = prompt("Enter number of columns:");
    if (colsRaw === null) return;

    const rows = parseInt(rowsRaw, 10);
    const cols = parseInt(colsRaw, 10);
    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
      alert("Invalid rows or columns.");
      return;
    }

    let tableHtml = `<table style="width:100%; border-collapse:collapse; border:1px solid #e5e7eb; margin:20px 0;">`;
    for (let r = 0; r < rows; r++) {
      tableHtml += "<tr>";
      for (let c = 0; c < cols; c++) {
        tableHtml += `<td style="padding:12px; border:1px solid #e5e7eb;">Cell</td>`;
      }
      tableHtml += "</tr>";
    }
    tableHtml += "</table><p><br></p>";

    execCommand("insertHTML", tableHtml);
  };

  const addHighlight = () => execCommand("backColor", "#fef3c7");

  const changeTextColor = () => {
    const color = prompt("Enter color (e.g., #ff0000 or red):");
    if (color) execCommand("foreColor", color);
  };

  const insertQuote = () => {
    const quoteHtml = `
      <blockquote style="background:#f0f9ff; border-left:5px solid #3b82f6; padding:20px; margin:20px 0; border-radius:5px; font-style:italic;">
        Click here to add your quote text...
      </blockquote>
      <p><br></p>
    `;
    execCommand("insertHTML", quoteHtml);
  };

  const insertInfoBox = () => {
    const infoBoxHtml = `
      <div style="background:#fef3c7; border:2px solid #f59e0b; padding:20px; border-radius:8px; margin:20px 0;">
        <h4 style="color:#92400e; margin:0 0 10px 0; font-size:16px;">💡 Important Information</h4>
        <p style="margin:0; color:#92400e; font-size:14px; line-height:1.6;">
          Click here to add your important information...
        </p>
      </div>
      <p><br></p>
    `;
    execCommand("insertHTML", infoBoxHtml);
  };

  const insertButton = () => {
    const text = prompt("Enter button text:") || "Click Here";
    const url = prompt("Enter button URL:") || "#";
    const color = prompt("Enter button color (e.g., #3b82f6 or blue):") || "#3b82f6";
    const buttonHtml = `
      <div style="text-align:center; margin:20px 0;">
        <a href="${url}" style="background:${color}; color:white; padding:15px 30px; text-decoration:none; border-radius:8px; font-weight:bold; display:inline-block;">
          ${text}
        </a>
      </div>
      <p><br></p>
    `;
    execCommand("insertHTML", buttonHtml);
  };

  const handleTemplateChange = (selectedTemplateId: string) => {
    setTemplateId(selectedTemplateId);

    // Check if it's one of our built-in templates
    if (JOB_TEMPLATES[selectedTemplateId as keyof typeof JOB_TEMPLATES]) {
      const template = JOB_TEMPLATES[selectedTemplateId as keyof typeof JOB_TEMPLATES];
      setContent(template.content);
      if (editorRef.current && !showHtmlCode) {
        editorRef.current.innerHTML = template.content;
      }
      if (!title) {
        setTitle(template.name);
      }
      return;
    }

    // Otherwise, look for it in the database templates
    const template = templates.find(t => t.id.toString() === selectedTemplateId);
    if (template) {
      // Handle different template structure formats
      if (template.structure && typeof template.structure === 'object') {
        const structure = template.structure as any;
        if (structure.content) {
          setContent(structure.content);
          if (editorRef.current && !showHtmlCode) {
            editorRef.current.innerHTML = structure.content;
          }
        } else if (structure.blocks) {
          const html = convertBlocksToHtml(structure.blocks);
          setContent(html);
          if (editorRef.current && !showHtmlCode) {
            editorRef.current.innerHTML = html;
          }
        }
      } else if ((template as any).content) {
        setContent((template as any).content);
        if (editorRef.current && !showHtmlCode) {
          editorRef.current.innerHTML = (template as any).content;
        }
      }
      if (!title) {
        setTitle(template.name);
      }
    }
  };

  const convertBlocksToHtml = (blocks: any[]) => {
    return blocks.map(block => {
      switch (block.type) {
        case 'heading':
          return `<h${block.level || 2} style="color: #1e40af; margin: 20px 0 10px 0;">${block.content}</h${block.level || 2}>`;
        case 'paragraph':
          return `<p style="margin: 10px 0; line-height: 1.6;">${block.content}</p>`;
        case 'table':
          return generateTableHtml(block.rows);
        default:
          return `<p style="margin: 10px 0; line-height: 1.6;">${block.content || ''}</p>`;
      }
    }).join('\n');
  };

  const generateTableHtml = (rows: any[]) => {
    const tableRows = rows.map(row =>
      `<tr>${row.cells.map((cell: string) => `<td style="padding: 12px; border: 1px solid #e5e7eb;">${cell}</td>`).join('')}</tr>`
    ).join('');

    return `<table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; margin: 20px 0;">${tableRows}</table>`;
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a post title.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!content.trim() || content === "Click on a template to get started, or start typing here...") {
      setError("Please add some content to your post.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const postData = {
        title: title.trim(),
        slug: title.toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-')
          .substring(0, 100),
        category_id: parseInt(categoryId),
        content: content,
        content_html: content,
        template_id: templateId ? parseInt(templateId) : null,
        external_url: externalUrl.trim() || null,
        thumbnail_url: thumbnailUrl.trim() || null,
        published_at: new Date().toISOString(),
        tag_ids: selectedTags.map(id => parseInt(id)),
      };

      const response = await api.post('/posts', postData);

      // Handle post_tags if needed
      if (selectedTags.length > 0 && response.data?.id) {
        try {
          await api.post(`/posts/${response.data.id}/tags`, {
            tag_ids: selectedTags.map(id => parseInt(id))
          });
        } catch (tagError) {
          console.warn('Could not associate tags:', tagError);
        }
      }

      router.push('/admin');
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create post.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleHtml = () => {
    if (!showHtmlCode) {
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
      setShowHtmlCode(true);
    } else {
      setShowHtmlCode(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
        <p className="text-gray-600">Select a template and edit directly in the visual editor below. Click anywhere to start editing!</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Visual Editor */}
          <div className="lg:col-span-2 space-y-6">

            {/* Visual Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Visual Editor
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleToggleHtml}
                  >
                    {showHtmlCode ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                    {showHtmlCode ? 'Visual' : 'HTML'}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Click anywhere in the content below to edit directly. Use the toolbar for formatting options.
                </CardDescription>
              </CardHeader>
              <CardContent>

                {/* Advanced Formatting Toolbar */}
                <div className="border rounded-t-md p-3 bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={formatBold} title="Bold">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={formatItalic} title="Italic">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={formatUnderline} title="Underline">
                      <Underline className="h-4 w-4" />
                    </Button>

                    <div className="w-px bg-gray-300 mx-1"></div>

                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={() => formatHeading(1)} title="Heading 1">
                      <Heading1 className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={() => formatHeading(2)} title="Heading 2">
                      <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={() => formatHeading(3)} title="Heading 3">
                      <Heading3 className="h-4 w-4" />
                    </Button>

                    <div className="w-px bg-gray-300 mx-1"></div>

                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={() => setAlignment('Left')} title="Align Left">
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={() => setAlignment('Center')} title="Align Center">
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={() => setAlignment('Right')} title="Align Right">
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={() => insertList(false)} title="Bullet List">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={() => insertList(true)} title="Numbered List">
                      <ListOrdered className="h-4 w-4" />
                    </Button>

                    <div className="w-px bg-gray-300 mx-1"></div>

                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={insertLink} title="Insert Link">
                      <Link2 className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={insertImage} title="Insert Image">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={insertTable} title="Insert Table">
                      <Table2 className="h-4 w-4" />
                    </Button>

                    <div className="w-px bg-gray-300 mx-1"></div>

                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={changeTextColor} title="Text Color">
                      <Palette className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={addHighlight} title="Highlight">
                      <div className="h-4 w-4 bg-yellow-300 rounded"></div>
                    </Button>
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={insertQuote} title="Insert Quote">
                      <Quote className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={insertInfoBox} title="Insert Info Box">
                      💡
                    </Button>
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={insertButton} title="Insert Button">
                      🔘
                    </Button>
                    <Button type="button" variant="outline" size="sm" onMouseDown={handleToolbarMouseDown} onClick={() => execCommand('insertParagraph')} title="Exit Block">
                      ↵
                    </Button>
                    <div className="flex items-center gap-2 ml-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onMouseDown={(e) => e.preventDefault()} // ✅ don't lose selection
                        onClick={() => {
                          const newSize = Math.max(8, fontSize - 1);
                          setFontSize(newSize);
                          setDraftSize(String(newSize));
                          applyFontSize(newSize);
                        }}
                        aria-label="Decrease font size"
                      >
                        -
                      </Button>

                      <span className="w-12 text-center">{fontSize}px</span>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          const newSize = Math.min(72, fontSize + 1);
                          setFontSize(newSize);
                          setDraftSize(String(newSize));
                          applyFontSize(newSize);
                        }}
                        aria-label="Increase font size"
                      >
                        +
                        <span className="sr-only">Increase font size</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Editor Area */}
                {showHtmlCode ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full min-h-[600px] p-4 font-mono text-sm border border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Edit HTML code directly..."
                  />
                ) : (
                  <div
                    ref={editorRef}
                    className="w-full min-h-[600px] p-4 border border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white overflow-y-auto"
                    style={{
                      maxHeight: '800px',
                      cursor: 'text',
                      lineHeight: '1.6',
                      direction: 'ltr'
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px rgb(59 130 246 / 0.5)';
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                    suppressContentEditableWarning={true}
                  // We do not set dangerouslySetInnerHTML here; editor DOM is controlled on mount and on mode switches
                  />
                )}

                <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
                  <span>💡 Tip: Click anywhere in the content above to start editing. Use toolbar for formatting.</span>
                  <span>Characters: {content.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">

            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Quick Start Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Select Template</Label>
                  <Select onValueChange={handleTemplateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="government-job">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Government Job Notification
                        </div>
                      </SelectItem>
                      <SelectItem value="exam-result">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Exam Result Declaration
                        </div>
                      </SelectItem>
                      <SelectItem value="admit-card">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Admit Card Release
                        </div>
                      </SelectItem>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Type className="h-4 w-4" />
                            {template.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Templates load with [placeholder] text that you can edit directly by clicking.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Post Details */}
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="post-title">Post Title *</Label>
                  <Input
                    id="post-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select onValueChange={setCategoryId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="external-url">External URL (Optional)</Label>
                  <Input
                    id="external-url"
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                  <p className="text-xs text-gray-500">Link to official notification</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail-url">Thumbnail URL (Optional)</Label>
                  <Input
                    id="thumbnail-url"
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500">Featured image for the post</p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags (Optional)</CardTitle>
                <CardDescription>
                  Select relevant tags to help categorize your post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id.toString()) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => handleTagToggle(tag.id.toString())}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      Selected: {selectedTags.length} tag(s)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Publish Button */}
            <Button
              type="submit"
              disabled={isLoading || !title.trim() || !categoryId || (!content.trim() || content === "Click on a template to get started, or start typing here...")}
              className="w-full text-lg py-6"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Publish Post
                </>
              )}
            </Button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-red-400 rounded-full"></div>
                  <p className="text-sm text-red-600 font-medium">Error</p>
                </div>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            )}

            {/* Help & Tips */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 text-sm">💡 Quick Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-700 space-y-2">
                <div className="space-y-1">
                  <p><strong>Templates:</strong> Pre-built layouts for different post types</p>
                  <p><strong>Placeholders:</strong> Replace [BRACKETS] with actual values</p>
                  <p><strong>Formatting:</strong> Use toolbar buttons for basic formatting</p>
                  <p><strong>Preview:</strong> Click eye icon to see how post will look</p>
                  <p><strong>HTML:</strong> Advanced users can edit HTML directly</p>
                </div>
              </CardContent>
            </Card>

            {/* Template Guide */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 text-sm">📋 Template Placeholders</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-green-700 space-y-1">
                <p><strong>[POST TITLE]</strong> - Job/Exam name</p>
                {/* other placeholder guidance unchanged */}
              </CardContent>
            </Card>

          </div>
        </div>
      </form>
    </div>
  );
}