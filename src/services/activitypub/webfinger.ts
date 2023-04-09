import axios from "axios";

export async function getActivityHref(domain: string, account: string) {
  // make axios request to domain with user as resource

  const axiosConfig = {
    headers: {
      "Accept": "application/jrd+json"
    }
  };

  const response = await axios.get(`https://${domain}/.well-known/webfinger?resource=acct:${account}@${domain}`, axiosConfig);
  const { data, status} = response;


  if (status !== 200) return null;

  const parsedSubject = data.subject?.split(":");
  const accountName = parsedSubject?.[1];
  if (!accountName || accountName !== `${account}@${domain}`) return null;

  const activityHref = data.links?.find((link: any) => link.rel === "self")?.href;
  if (!activityHref) return null;

  return activityHref;
}