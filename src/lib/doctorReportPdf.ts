import type {
  DoctorReportSummary,
  ReportCount,
} from './doctorReport';

import type {
  UserProfile,
} from './profile';

function escapeHtml(value: string): string {
  const characters: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return value.replace(
    /[&<>"']/g,
    (character) =>
      characters[character] ?? character,
  );
}

function formatDate(
  dateValue: string | null,
): string {
  if (!dateValue) {
    return 'No entries';
  }

  const date = new Date(
    `${dateValue}T00:00:00`,
  );

  return date.toLocaleDateString(
    'en-CA',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  );
}

function renderCountList(
  items: ReportCount[],
  emptyMessage: string,
): string {
  if (items.length === 0) {
    return `
      <p class="empty">
        ${escapeHtml(emptyMessage)}
      </p>
    `;
  }

  return `
    <div class="count-list">
      ${items
        .map(
          (item) => `
            <div class="count-row">
              <span>
                ${escapeHtml(item.label)}
              </span>

              <strong>
                ${item.count}
              </strong>
            </div>
          `,
        )
        .join('')}
    </div>
  `;
}

function removeMoodEmoji(
  value: string,
): string {
  const firstSpace =
    value.indexOf(' ');

  if (firstSpace === -1) {
    return value;
  }

  return value
    .slice(firstSpace + 1)
    .trim();
}

export function buildDoctorReportHtml(
  report: DoctorReportSummary,
  profile?: UserProfile,
): string {
  const generatedOn =
    new Date().toLocaleDateString(
      'en-CA',
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      },
    );

  const loggedDateRange = `${
    formatDate(report.firstLoggedDate)
  } – ${
    formatDate(report.lastLoggedDate)
  }`;

  const reportName =
  profile?.fullName.trim() ||
  profile?.preferredName.trim() ||
  '';

const dateOfBirth =
  profile?.dateOfBirth.trim() ||
  '';

const patientInformation =
  reportName || dateOfBirth
    ? `
      <div class="patient-info">
        ${
          reportName
            ? `
              <span>
                <strong>Prepared for:</strong>
                ${escapeHtml(reportName)}
              </span>
            `
            : ''
        }

        ${
          dateOfBirth
            ? `
              <span>
                <strong>Date of birth:</strong>
                ${escapeHtml(
                  formatDate(dateOfBirth),
                )}
              </span>
            `
            : ''
        }
      </div>
    `
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />

    <style>
      @page {
        size: Letter;
        margin: 0;
      }

      * {
        box-sizing: border-box;
      }

      .patient-info {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-top: 18px;
  padding: 11px 13px;
  background: #f7f4ed;
  border-radius: 8px;
  color: #333333;
  font-size: 11px;
}

      body {
        margin: 0;
        padding: 38px;
        background: #ffffff;
        color: #202020;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        line-height: 1.5;
      }

      .header {
        padding-bottom: 22px;
        border-bottom: 3px solid #d4af37;
        margin-bottom: 24px;
      }

      .brand {
        color: #c2183a;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      h1 {
        margin: 5px 0 4px;
        color: #171717;
        font-size: 30px;
        line-height: 1.15;
      }

      .subtitle {
        margin: 0;
        color: #666666;
        font-size: 13px;
      }

      .meta {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        margin-top: 18px;
        color: #555555;
        font-size: 11px;
      }

      .summary-grid {
        display: flex;
        gap: 10px;
        margin-bottom: 22px;
      }

      .summary-card {
        flex: 1;
        padding: 14px;
        background: #f7f4ed;
        border: 1px solid #e4dcc8;
        border-radius: 10px;
        text-align: center;
      }

      .summary-number {
        display: block;
        color: #a98716;
        font-size: 24px;
        font-weight: 800;
      }

      .summary-label {
        display: block;
        margin-top: 2px;
        color: #555555;
        font-size: 10px;
      }

      .section {
        page-break-inside: avoid;
        margin-bottom: 18px;
        padding: 17px;
        border: 1px solid #dddddd;
        border-radius: 12px;
      }

      .section h2 {
        margin: 0 0 5px;
        color: #171717;
        font-size: 17px;
      }

      .section-description {
        margin: 0 0 12px;
        color: #666666;
        font-size: 11px;
      }

      .subheading {
        margin: 14px 0 7px;
        color: #a98716;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.6px;
        text-transform: uppercase;
      }

      .count-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .count-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 8px 10px;
        background: #f7f7f7;
        border-radius: 7px;
      }

      .count-row strong {
        min-width: 25px;
        padding: 3px 8px;
        background: #d4af37;
        color: #171717;
        border-radius: 12px;
        text-align: center;
      }

      .detail-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }

      .detail {
        flex: 1;
        min-width: 30%;
        padding: 10px;
        background: #f7f4ed;
        border-radius: 8px;
      }

      .detail strong {
        display: block;
        color: #a98716;
        font-size: 18px;
      }

      .detail span {
        color: #555555;
        font-size: 10px;
      }

      .empty {
        margin: 0;
        color: #777777;
        font-style: italic;
      }

      .disclaimer {
        page-break-inside: avoid;
        margin-top: 22px;
        padding: 15px;
        background: #f3f3f3;
        border-left: 4px solid #c2183a;
        color: #555555;
        font-size: 10px;
      }

      .disclaimer strong {
        display: block;
        margin-bottom: 4px;
        color: #202020;
      }

      .footer {
        margin-top: 25px;
        padding-top: 12px;
        border-top: 1px solid #dddddd;
        color: #777777;
        font-size: 9px;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <header class="header">
      <div class="brand">
        The Hot Mess Hormone Club
      </div>

      <h1>Doctor's Report</h1>

      <p class="subtitle">
        A summary of self-reported symptoms,
        mood, sleep, supplements, and bleeding.
      </p>

      ${patientInformation}

      <div class="meta">
        <span>
          Reporting period:
          Last ${report.rangeDays} days
        </span>

        <span>
          Generated:
          ${escapeHtml(generatedOn)}
        </span>
      </div>

      <div class="meta">
        <span>
          Logged date range:
          ${escapeHtml(loggedDateRange)}
        </span>
      </div>
    </header>

    <section class="summary-grid">
      <div class="summary-card">
        <span class="summary-number">
          ${report.loggedDays}
        </span>

        <span class="summary-label">
          Logged days
        </span>
      </div>

      <div class="summary-card">
        <span class="summary-number">
          ${report.bleedingDays}
        </span>

        <span class="summary-label">
          Bleeding days
        </span>
      </div>

      <div class="summary-card">
        <span class="summary-number">
          ${report.sleep.loggedNights}
        </span>

        <span class="summary-label">
          Sleep logs
        </span>
      </div>
    </section>

    <section class="section">
      <h2>Most Logged Symptoms</h2>

      <p class="section-description">
        Symptoms appearing most often during
        this reporting period.
      </p>

      ${renderCountList(
  report.moods.map((mood) => ({
    ...mood,
    label: removeMoodEmoji(
      mood.label,
    ),
  })),
  'No moods were logged.',
)}
    </section>

    <section class="section">
      <h2>Mood Patterns</h2>

      ${renderCountList(
        report.moods,
        'No moods were logged.',
      )}
    </section>

    <section class="section">
      <h2>Sleep Patterns</h2>

      <div class="subheading">
        Sleep quality
      </div>

      ${renderCountList(
        report.sleep.qualities,
        'No sleep quality data was logged.',
      )}

      <div class="subheading">
        Sleep duration
      </div>

      ${renderCountList(
        report.sleep.durations,
        'No sleep duration data was logged.',
      )}

      <div class="detail-grid">
        <div class="detail">
          <strong>
            ${report.sleep.frequentWakingNights}
          </strong>

          <span>
            Nights with frequent waking
          </span>
        </div>

        <div class="detail">
          <strong>
            ${report.sleep.nightSweatNights}
          </strong>

          <span>
            Nights with night sweats
          </span>
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Cycle &amp; Bleeding</h2>

      <div class="detail-grid">
        <div class="detail">
          <strong>
            ${report.periodStarts}
          </strong>

          <span>
            Period starts
          </span>
        </div>

        <div class="detail">
          <strong>
            ${report.bleedingDays}
          </strong>

          <span>
            Bleeding days
          </span>
        </div>

        <div class="detail">
          <strong>
            ${report.spottingDays}
          </strong>

          <span>
            Spotting days
          </span>
        </div>
      </div>

      <div class="subheading">
        Logged flow
      </div>

      ${renderCountList(
        report.flowLevels,
        'No Flow information was logged.',
      )}
    </section>

    <section class="section">
      <h2>Supplements Logged</h2>

      ${renderCountList(
        report.supplements,
        'No supplements were logged.',
      )}
    </section>

    <aside class="disclaimer">
      <strong>
        Important information
      </strong>

      This report summarizes information entered
      by the app user. It does not provide a
      diagnosis, determine the cause of symptoms,
      or replace medical advice from a qualified
      healthcare professional.
    </aside>

    <footer class="footer">
      TheHotMessHormoneClub.com
    </footer>
  </body>
</html>
  `;
}