import React, { useRef, useState } from "react";
import { EnvelopeClosedIcon } from "@navikt/aksel-icons";
import { Alert, Button, Modal, Select, TextField } from "@navikt/ds-react";
import {
  MicrofrontendApp,
  MicrofrontendConfig,
} from "../../config/microfrontend";

type Props = {
  showTilbakemelding: boolean;
  setShowTilbakemelding: (show: boolean) => void;
};

type FeedbackData = {
  feedback: string;
  app: string;
};

export default function Tilbakemelding(props: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    feedback: "",
    app: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      ref.current?.close();
      props.setShowTilbakemelding(false);
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFeedbackData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Button
        icon={<EnvelopeClosedIcon />}
        className="rounded-3xl"
        variant="secondary"
        onClick={() => ref.current?.showModal()}
      >
        Tilbakemelding
      </Button>

      <Modal
        ref={ref}
        header={{ heading: "Gi din tilbakemelding" }}
        width={600}
      >
        <Modal.Body>
          {submitted ? (
            <Alert variant="success">Takk for din tilbakemelding!</Alert>
          ) : (
            <form method="dialog" id="skjema" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
                <TextField
                  label="Har du noen tilbakemeldinger?"
                  name="feedback"
                  value={feedbackData.feedback}
                  onChange={handleChange}
                />
                <Select
                  label={"Hvilken applikasjon gjelder det?"}
                  name="app"
                  value={feedbackData.app}
                  onChange={handleChange}
                >
                  <option key={""} value={""}>
                    - Velg applikasjon -
                  </option>
                  {MicrofrontendConfig.map((app: MicrofrontendApp) => (
                    <option key={app.app} value={app.app}>
                      {app.title}
                    </option>
                  ))}
                </Select>
              </div>
            </form>
          )}
        </Modal.Body>
        {!submitted && (
          <Modal.Footer>
            <Button form="skjema">Send</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => ref.current?.close()}
            >
              Avbryt
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
}
