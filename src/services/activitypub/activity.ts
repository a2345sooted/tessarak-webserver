import axios from "axios";

export async function getActor(actorHref: string) {
  const axiosConfig = {
    headers: {
      "Accept": "application/activity+json"
    }
  };

  const response = await axios.get(actorHref, axiosConfig);
  const { data, status} = response;

  if (status !== 200) return null;

  return data;
}

export async function getActorOutbox(actorHref: string) {
  const axiosConfig = {
    headers: {
      "Accept": "application/activity+json"
    }
  };

  const actor = await getActor(actorHref);
  if (!actor) return null;

  const outboxHref = actor.outbox;
  if (!outboxHref) return null;

  const response = await axios.get(outboxHref, axiosConfig);
  const { data, status} = response;

  if (status !== 200) return null;

  return data;
}

export async function getOutboxItems(outboxHref: string) {
  const axiosConfig = {
    headers: {
      "Accept": "application/activity+json"
    }
  };

  const response = await axios.get(outboxHref, axiosConfig);
  const { data, status} = response;

  if (status !== 200) return null;

  return data;
}