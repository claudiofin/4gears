
// Follow this setup guide to deploy this function and set up the trigger:
// 1. Deploy: `supabase functions deploy handle-submission`
// 2. Set secrets: `supabase secrets set RESEND_API_KEY=re_xxx`
// 3. Create Webhook:
//    - Trigger: `INSERT` on table `submission_requests`
//    - Target: `HTTP Request`
//    - URL: Your function URL
//    - Secret: Your JWT secret

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

Deno.serve(async (req: Request) => {
    try {
        const payload = await req.json();
        const { record } = payload; // Supabase webhook sends the record in this field

        console.log(`🚀 New submission received: ${record.id} for project ${record.project_id}`);

        // Simulation of a notification process
        // In a real scenario, you would use Resend, SendGrid, or Slack Webhooks here.

        const notificationMessage = `
      New 4Gears Project Request!
      ---------------------------
      Project: ${record.project_name || 'N/A'}
      Customer Notes: ${record.notes}
      Test Email: ${record.test_email}
      Contact: ${record.phone_number}
      Status: ${record.status}
    `;

        console.log("📨 Sending notification to admins...");
        console.log(notificationMessage);

        // Mocking a successful response from an email provider
        const mockSuccess = true;

        if (!mockSuccess) {
            throw new Error("Failed to send notification email");
        }

        return new Response(
            JSON.stringify({
                message: "Notification sent successfully",
                submission_id: record.id
            }),
            { headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
});
