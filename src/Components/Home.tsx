import React, { useState } from 'react'
import './Home.css';
import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper, Typography } from '@material-ui/core'
import { Field, Form, Formik, FormikConfig, FormikValues } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui'
import { object, mixed, number } from 'yup'

const sleep = (time: number) => new Promise((acc) => setTimeout(acc, time));

function Home() {

    return (
        <div className="Application__Card">
            <Card>
                <CardContent>
                    <FormikStepper

                        initialValues={{
                            firstName: "",
                            lastName: "",
                            Millionaire: "",
                            money: 0,
                            description: ""
                        }} onSubmit={async (values) => {
                            await sleep(3000)
                            console.log(values)

                        }}
                    >

                        <FormikStep label="User Bio">
                            <Box paddingBottom={2}>
                                <Field fullWidth name="first__name" component={TextField} label="First Name" />
                            </Box>
                            <Box paddingBottom={2}>
                                <Field fullWidth name="last__name" component={TextField} label="Last Name" />
                            </Box>
                            <Box paddingBottom={2}>
                                <Field name="Millionaire" type="checkbox" component={CheckboxWithLabel} Label={{ label: "I Am Millionaire" }} />
                            </Box>
                        </FormikStep>

                        <FormikStep label="User Bank Info"
                            validationSchema={object({
                                money: mixed().when('Millionaire', {
                                    is: true,
                                    then: number().required().min(1_000_000, 'Because you said you are a millionaire you need to have 1 million'),
                                    otherwise: number().required(),
                                })
                            })}>
                            <Box paddingBottom={2}>
                                <Field fullWidth name="money" type="number" component={TextField} label="All The Money, I Have" />
                            </Box>
                        </FormikStep>

                        <FormikStep label="User Bank Description">
                            <Box paddingBottom={2}>
                                <Field fullWidth name="description" component={TextField} label="Description" />
                            </Box>
                        </FormikStep>

                    </FormikStepper>
                </CardContent>
            </Card>
        </div >
    )
}

export default Home

export interface FormikStepProps extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
    label: string
}

export function FormikStep({ children }: FormikStepProps) {
    return <>{children}</>
}

export function FormikStepper({ children, ...props }: FormikConfig<FormikValues>) {
    const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[];
    const [step, setStep] = useState(0);
    const childrenStep = childrenArray[step];
    const [completed, setCompleted] = useState(false);

    function isLastStep() {
        return step === childrenArray.length - 1
    }
    return (
        <Formik
            {...props}
            validationSchema={childrenStep.props.validationSchema}
            onSubmit={async (values, helpers) => {
                if (isLastStep()) {
                    await props.onSubmit(values, helpers);
                    setCompleted(true);
                    // helpers.resetForm();
                } else {
                    setStep(s => s + 1);
                }
            }}
        >
            {({ isSubmitting }) => (

                <Form autoComplete="off" >
                    <Stepper alternativeLabel activeStep={step}>
                        {childrenArray.map((child, index) => (
                            <Step key={child.props.label} completed={step > index || completed} >
                                <StepLabel>{child.props.label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {childrenStep}
                    <Grid container spacing={3}>

                        {step > 0 ?
                            <Grid item>
                                <Button disabled={isSubmitting} variant="contained"
                                    color="primary" onClick={() => setStep(s => s - 1)}>Back</Button>
                            </Grid>
                            : null}
                        <Grid item>
                            <Button
                                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                disabled={isSubmitting} variant="contained"
                                color="primary" type="submit">{isSubmitting ? 'Submitting' : isLastStep() ? "Submit" : "Next"}</Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    )
}