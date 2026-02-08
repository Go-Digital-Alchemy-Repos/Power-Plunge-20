import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import AdminNav from "@/components/admin/AdminNav";
import {
  Mail, Copy, Check, Loader2, Link2, UserPlus, Share2,
  MessageSquare, ChevronDown, ChevronUp, Phone, ShieldCheck,
  PenLine,
} from "lucide-react";

interface InviteResponse {
  invite: {
    id: string;
    inviteCode: string;
    targetEmail: string | null;
    targetPhone: string | null;
    targetName: string | null;
    expiresAt: string | null;
    maxUses: number;
  };
  inviteUrl: string;
  emailSent: boolean;
  emailError: string | null;
}

type InviteMode = "quick" | "manual";

export default function AdminAffiliateInviteSender() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { admin, isLoading: adminLoading, isAuthenticated, role, hasFullAccess } = useAdmin();

  const [mode, setMode] = useState<InviteMode>("quick");
  const [formData, setFormData] = useState({
    targetEmail: "",
    targetPhone: "",
    targetName: "",
    maxUses: "1",
    expiresInDays: "7",
    notes: "",
  });

  const [lastResult, setLastResult] = useState<InviteResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const supportsNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const sendInviteMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/admin/affiliate-invites/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targetEmail: data.targetEmail.trim() || undefined,
          targetPhone: data.targetPhone.trim() || undefined,
          targetName: data.targetName.trim() || undefined,
          maxUses: parseInt(data.maxUses) || 1,
          expiresInDays: parseInt(data.expiresInDays) || undefined,
          notes: data.notes.trim() || undefined,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to create invite");
      return result as InviteResponse;
    },
    onSuccess: async (data) => {
      setLastResult(data);

      if (mode === "quick") {
        await triggerNativeShare(data);
      }

      if (data.emailSent) {
        toast({
          title: "Invite Sent!",
          description: `Invite email sent to ${data.invite.targetEmail}`,
        });
      } else {
        toast({
          title: "Invite Created",
          description: mode === "quick"
            ? "Share the link using your preferred app."
            : "Use the options below to send it.",
        });
      }

      setFormData(prev => ({ ...prev, targetEmail: "", targetPhone: "", targetName: "", notes: "" }));
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create invite",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const triggerNativeShare = async (data: InviteResponse) => {
    const shareText = data.invite.targetName
      ? `Hi ${data.invite.targetName}, here's your private affiliate signup link for Power Plunge: ${data.inviteUrl}`
      : `Here's your private Power Plunge affiliate signup link: ${data.inviteUrl}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Power Plunge Affiliate Invite",
          text: shareText,
          url: data.inviteUrl,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          toast({
            title: "Share cancelled",
            description: "You can still copy or share the link below.",
          });
        }
      }
    }
  };

  const handleQuickCreate = () => {
    sendInviteMutation.mutate({ ...formData, targetEmail: "", targetPhone: "", targetName: "" });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendInviteMutation.mutate(formData);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast({ title: "Copied!", description: "Invite link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSmsShare = () => {
    if (!lastResult) return;
    const body = lastResult.invite.targetName
      ? `Hi ${lastResult.invite.targetName}, here's your Power Plunge affiliate signup link: ${lastResult.inviteUrl}`
      : `Here's your Power Plunge affiliate signup link: ${lastResult.inviteUrl}`;
    window.open(`sms:${lastResult.invite.targetPhone || ""}?body=${encodeURIComponent(body)}`, "_self");
  };

  const handleEmailShare = () => {
    if (!lastResult) return;
    const subject = "You're Invited to the Power Plunge Affiliate Program";
    const body = lastResult.invite.targetName
      ? `Hi ${lastResult.invite.targetName},\n\nYou've been invited to join the Power Plunge affiliate program! Use the link below to sign up:\n\n${lastResult.inviteUrl}\n\nBest regards`
      : `You've been invited to join the Power Plunge affiliate program! Use the link below to sign up:\n\n${lastResult.inviteUrl}\n\nBest regards`;
    const mailto = `mailto:${lastResult.invite.targetEmail || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_self");
  };

  const handleNewInvite = () => {
    setLastResult(null);
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !hasFullAccess) {
    setLocation("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav currentPage="affiliates" role={role} />

      <div className="max-w-lg mx-auto px-4 py-6 sm:py-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
            <UserPlus className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Invite Affiliate</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create and share an invite link.
          </p>
        </div>

        {!lastResult ? (
          <>
            <div className="flex rounded-lg border border-border overflow-hidden mb-5" data-testid="mode-toggle">
              <button
                type="button"
                onClick={() => setMode("quick")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-medium transition-colors ${
                  mode === "quick"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                data-testid="button-mode-quick"
              >
                <Share2 className="w-4 h-4" />
                Share from Contacts
              </button>
              <button
                type="button"
                onClick={() => setMode("manual")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-medium transition-colors ${
                  mode === "manual"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                data-testid="button-mode-manual"
              >
                <PenLine className="w-4 h-4" />
                Enter Details
              </button>
            </div>

            {mode === "quick" ? (
              <Card data-testid="card-quick-share">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Share from Contacts</CardTitle>
                  <CardDescription>
                    {supportsNativeShare
                      ? "Create a link and share it with a contact."
                      : "Create a link you can copy and send."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full h-14 text-base font-semibold"
                    onClick={handleQuickCreate}
                    disabled={sendInviteMutation.isPending}
                    data-testid="button-quick-create"
                  >
                    {sendInviteMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5 mr-2" />
                        {supportsNativeShare ? "Create & Share" : "Create Invite Link"}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card data-testid="card-manual-entry">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Enter Details</CardTitle>
                  <CardDescription>
                    Add name, email, or phone for the invite.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="targetName">Name</Label>
                      <Input
                        id="targetName"
                        type="text"
                        placeholder="Jane Smith"
                        value={formData.targetName}
                        onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
                        className="h-12 text-base"
                        data-testid="input-target-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetEmail">Email address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="targetEmail"
                          type="email"
                          placeholder="affiliate@example.com"
                          value={formData.targetEmail}
                          onChange={(e) => setFormData({ ...formData, targetEmail: e.target.value })}
                          className="pl-11 h-12 text-base"
                          autoComplete="email"
                          data-testid="input-target-email"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        If provided, the invite will be locked to this email and a notification email is sent automatically.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetPhone">Phone number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="targetPhone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.targetPhone}
                          onChange={(e) => setFormData({ ...formData, targetPhone: e.target.value })}
                          className="pl-11 h-12 text-base"
                          autoComplete="tel"
                          data-testid="input-target-phone"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        If provided, the recipient must verify this phone via SMS before signing up.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      data-testid="button-toggle-options"
                    >
                      {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {showAdvanced ? "Hide advanced options" : "Advanced options"}
                    </button>

                    {showAdvanced && (
                      <div className="space-y-4 pt-2 border-t border-border">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="maxUses">Max uses</Label>
                            <Input
                              id="maxUses"
                              type="number"
                              min="1"
                              max="100"
                              value={formData.maxUses}
                              onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                              className="h-12 text-base"
                              data-testid="input-max-uses"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expiresInDays">Expires in (days)</Label>
                            <Input
                              id="expiresInDays"
                              type="number"
                              min="1"
                              max="365"
                              value={formData.expiresInDays}
                              onChange={(e) => setFormData({ ...formData, expiresInDays: e.target.value })}
                              className="h-12 text-base"
                              data-testid="input-expires-days"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes (internal only)</Label>
                          <Textarea
                            id="notes"
                            placeholder="Internal notes about this invite..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={2}
                            className="text-base"
                            data-testid="input-notes"
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={sendInviteMutation.isPending}
                      className="w-full h-14 text-base font-semibold"
                      data-testid="button-send-invite"
                    >
                      {sendInviteMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5 mr-2" />
                          Create Invite
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card className="border-primary/30" data-testid="card-invite-result">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Invite Ready
              </CardTitle>
              <CardDescription>
                {lastResult.emailSent
                  ? `A notification email was also sent to ${lastResult.invite.targetEmail}.`
                  : "Send the invite using one of the options below."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Invite Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={lastResult.inviteUrl}
                    readOnly
                    className="text-sm font-mono flex-1"
                    data-testid="input-invite-url"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 h-10 w-10"
                    onClick={() => copyToClipboard(lastResult.inviteUrl)}
                    data-testid="button-copy-url"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Send Invite</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-12 text-base"
                    onClick={handleSmsShare}
                    data-testid="button-share-sms"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Text Invite
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 text-base"
                    onClick={handleEmailShare}
                    data-testid="button-share-email"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email Invite
                  </Button>
                </div>
                {supportsNativeShare && (
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base"
                    onClick={() => triggerNativeShare(lastResult)}
                    data-testid="button-share-native"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    More Sharing Options
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="w-full h-10 text-sm"
                  onClick={() => copyToClipboard(lastResult.inviteUrl)}
                  data-testid="button-copy-link"
                >
                  {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>

              {!lastResult.emailSent && lastResult.emailError && lastResult.invite.targetEmail && (
                <p className="text-sm text-amber-600" data-testid="text-email-warning">
                  Auto-email not sent: {lastResult.emailError}
                </p>
              )}

              <div className="pt-3 border-t border-border space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Code</span>
                  <span className="font-mono">{lastResult.invite.inviteCode}</span>
                </div>
                {lastResult.invite.targetName && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Name</span>
                    <span>{lastResult.invite.targetName}</span>
                  </div>
                )}
                {lastResult.invite.targetEmail && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Locked to email</span>
                    <span>{lastResult.invite.targetEmail}</span>
                  </div>
                )}
                {lastResult.invite.targetPhone && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-primary" />
                      Phone verification
                    </span>
                    <span>{lastResult.invite.targetPhone}</span>
                  </div>
                )}
                {lastResult.invite.expiresAt && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Expires</span>
                    <span>{new Date(lastResult.invite.expiresAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Max uses</span>
                  <span>{lastResult.invite.maxUses}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={handleNewInvite}
                data-testid="button-new-invite"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Another Invite
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 p-4 bg-muted/50 rounded-xl text-center">
          <Share2 className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Tip:</strong> On iPhone, tap the Share button in Safari and choose "Add to Home Screen" to create a quick-access shortcut to this page.
          </p>
        </div>
      </div>
    </div>
  );
}
